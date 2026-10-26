import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendApiError } from '../apiError';

const router = Router();

// Helper to parse and validate ID parameter
function parseId(idStr: string): number | null {
  const id = parseInt(idStr, 10);
  return isNaN(id) ? null : id;
}

// GET /api/products - Get all products or filter by active status
router.get('/', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';

    const products = await prisma.product.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    res.json(products);
  } catch (error) {
    sendApiError(res, error, 'Products GET error:', 'Failed to fetch products');
  }
});

// POST /api/products - Create a new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.name || !body.price || !body.category) {
      res.status(400).json({ error: 'Name, price, and category are required' });
      return;
    }

    if (typeof body.price !== 'number' || body.price <= 0) {
      res.status(400).json({ error: 'Price must be a positive number' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        price: body.price,
        category: body.category.trim(),
        isActive: body.isActive ?? true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    sendApiError(res, error, 'Products POST error:', 'Failed to create product');
  }
});

// GET /api/products/:id - Get a single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseId(String(req.params.id));
    if (id === null) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    sendApiError(res, error, 'Product GET error:', 'Failed to fetch product');
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseId(String(req.params.id));
    if (id === null) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const body = req.body;

    if (!body.name || !body.price || !body.category) {
      res.status(400).json({ error: 'Name, price, and category are required' });
      return;
    }

    if (typeof body.price !== 'number' || body.price <= 0) {
      res.status(400).json({ error: 'Price must be a positive number' });
      return;
    }

    // Check if product exists first
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name.trim(),
        price: body.price,
        category: body.category.trim(),
        isActive: body.isActive,
      },
    });

    res.json(product);
  } catch (error) {
    sendApiError(res, error, 'Product PUT error:', 'Failed to update product');
  }
});

// PATCH /api/products/:id - Toggle product active status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseId(String(req.params.id));
    if (id === null) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const body = req.body;

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        isActive: body.isActive,
      },
    });

    res.json(product);
  } catch (error) {
    sendApiError(res, error, 'Product PATCH error:', 'Failed to update product status');
  }
});

export default router;
