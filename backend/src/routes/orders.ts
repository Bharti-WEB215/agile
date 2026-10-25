import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { prisma } from '../prisma';

const router = Router();

// Valid status transitions (state machine)
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['APPROVED', 'CANCELLED'],
  APPROVED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

// Helper to generate unique order number
function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
  const unique = randomUUID().slice(0, 6).toUpperCase();
  return `ORD-${dateStr}-${unique}`;
}

// Helper to parse and validate ID parameter
function parseId(idStr: string): number | null {
  const id = parseInt(idStr, 10);
  return isNaN(id) ? null : id;
}

// GET /api/orders - Get all orders or filter by status
router.get('/', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const kitchenView = req.query.kitchen === 'true';

    const whereClause = kitchenView
      ? { status: { in: ['APPROVED', 'PREPARING', 'READY'] as any[] } }
      : status
      ? { status: status as any }
      : undefined;

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/pending-approval - Get all pending QR orders
router.get('/pending-approval', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        source: 'QR',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Pending approval GET error:', error);
    res.status(500).json({ error: 'Failed to fetch pending orders' });
  }
});

// POST /api/orders - Create a new order (CASHIER source)
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Order must have at least one item' });
      return;
    }

    if (!body.paymentMode) {
      res.status(400).json({ error: 'Payment mode is required' });
      return;
    }

    const validPaymentModes = ['CASH', 'UPI', 'CARD'];
    if (!validPaymentModes.includes(body.paymentMode)) {
      res.status(400).json({ error: 'Invalid payment mode' });
      return;
    }

    // Fetch actual product prices from database (prevent price tampering)
    const productIds = body.items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({ error: 'One or more products are invalid or inactive' });
      return;
    }

    const productPriceMap = new Map(products.map(p => [p.id, parseFloat(p.price.toString())]));

    // Validate quantities and calculate server-side total
    const orderItems = body.items.map((item: any) => {
      const serverPrice = productPriceMap.get(item.productId);
      if (!serverPrice) throw new Error(`Product ${item.productId} not found`);
      if (!item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        throw new Error(`Invalid quantity for product ${item.productId}`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: serverPrice,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create order — CASHIER orders go directly to APPROVED
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        totalAmount,
        paymentMode: body.paymentMode,
        status: 'APPROVED',
        source: 'CASHIER',
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Orders POST error:', error);
    if (error.message?.includes('Invalid quantity') || error.message?.includes('not found')) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/orders/customer - Create a customer order via QR
router.post('/customer', async (req: Request, res: Response) => {
  try {
    const { tableToken, items } = req.body;

    if (!tableToken || typeof tableToken !== 'string') {
      res.status(400).json({ error: 'Table token is required' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must have at least one item' });
      return;
    }

    // Find the table by QR token
    const table = await prisma.table.findUnique({
      where: { qrToken: tableToken },
    });

    if (!table) {
      res.status(404).json({ error: 'Invalid table QR code' });
      return;
    }

    if (!table.isActive) {
      res.status(403).json({ error: 'This table is currently inactive' });
      return;
    }

    // Fetch actual product prices from database (prevent price tampering)
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({ error: 'One or more products are invalid or inactive' });
      return;
    }

    const productPriceMap = new Map(products.map(p => [p.id, parseFloat(p.price.toString())]));

    // Calculate total using server-side prices
    const orderItems = items.map((item: any) => {
      const serverPrice = productPriceMap.get(item.productId);
      if (!serverPrice) throw new Error(`Product ${item.productId} not found`);
      if (!item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        throw new Error(`Invalid quantity for product ${item.productId}`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: serverPrice,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        totalAmount,
        status: 'PENDING',
        source: 'QR',
        tableId: table.id,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Customer order POST error:', error);
    if (error.message?.includes('Invalid quantity') || error.message?.includes('not found')) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to create customer order' });
  }
});

// GET /api/orders/:id - Get a single order
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseId(String(req.params.id));
    if (id === null) {
      res.status(400).json({ error: 'Invalid order ID' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Order GET error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/approve - Approve a pending customer order
router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const id = parseId(String(req.params.id));
    if (id === null) {
      res.status(400).json({ error: 'Invalid order ID' });
      return;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (existingOrder.status !== 'PENDING') {
      res.status(400).json({ error: 'Only PENDING orders can be approved' });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Order approve error:', error);
    res.status(500).json({ error: 'Failed to approve order' });
  }
});

// PATCH /api/orders/:id - Update order status with state machine validation
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseId(String(req.params.id));
    if (id === null) {
      res.status(400).json({ error: 'Invalid order ID' });
      return;
    }

    const body = req.body;

    if (!body.status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    const validStatuses = ['PENDING', 'APPROVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(body.status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    // Fetch current order to validate transition
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Validate status transition
    const allowedNextStatuses = VALID_TRANSITIONS[existingOrder.status] || [];
    if (!allowedNextStatuses.includes(body.status)) {
      res.status(400).json({
        error: `Cannot transition from ${existingOrder.status} to ${body.status}. Allowed: ${allowedNextStatuses.join(', ') || 'none'}`,
      });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Order PATCH error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
