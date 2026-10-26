import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendApiError } from '../apiError';

const router = Router();

// Helper to get today's date
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to validate date string
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// GET /api/reports/daily-sales - Get daily sales report
router.get('/daily-sales', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date as string | undefined;
    const targetDate = dateParam || getTodayDate();

    if (!isValidDate(targetDate)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      return;
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all orders for the day
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalOrders = orders.length;

    // Revenue only from COMPLETED orders
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount.toString()),
      0
    );

    // Group by status
    const ordersByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Group by payment mode
    const ordersByPaymentMode = orders.reduce(
      (acc, order) => {
        if (order.paymentMode) {
          acc[order.paymentMode] = (acc[order.paymentMode] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    res.json({
      date: targetDate,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      ordersByPaymentMode,
    });
  } catch (error) {
    sendApiError(res, error, 'Daily sales report error:', 'Failed to generate daily sales report');
  }
});

// GET /api/reports/item-sales - Get item-wise sales report
router.get('/item-sales', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    if (startDate && !isValidDate(startDate)) {
      res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD.' });
      return;
    }
    if (endDate && !isValidDate(endDate)) {
      res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD.' });
      return;
    }

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
      dateFilter.gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
      dateFilter.lte.setHours(23, 59, 59, 999);
    }

    // Only include items from COMPLETED orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          status: 'COMPLETED',
          ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
        },
      },
      include: {
        product: true,
      },
    });

    // Aggregate by product
    const itemSalesMap = new Map<number, any>();

    orderItems.forEach((item) => {
      const existing = itemSalesMap.get(item.productId);
      const revenue = parseFloat(item.price.toString()) * item.quantity;

      if (existing) {
        existing.quantitySold += item.quantity;
        existing.totalRevenue += revenue;
      } else {
        itemSalesMap.set(item.productId, {
          productId: item.productId,
          productName: item.product.name,
          category: item.product.category,
          quantitySold: item.quantity,
          totalRevenue: revenue,
        });
      }
    });

    const itemSales = Array.from(itemSalesMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    res.json(itemSales);
  } catch (error) {
    sendApiError(res, error, 'Item sales report error:', 'Failed to generate item sales report');
  }
});

// GET /api/reports/payment-summary - Get payment mode summary
router.get('/payment-summary', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    if (startDate && !isValidDate(startDate)) {
      res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD.' });
      return;
    }
    if (endDate && !isValidDate(endDate)) {
      res.status(400).json({ error: 'Invalid endDate format. Use YYYY-MM-DD.' });
      return;
    }

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
      dateFilter.gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
      dateFilter.lte.setHours(23, 59, 59, 999);
    }

    // Only include COMPLETED orders
    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
      },
    });

    const paymentSummaryMap = new Map<string, any>();

    orders.forEach((order) => {
      if (!order.paymentMode) return;

      const existing = paymentSummaryMap.get(order.paymentMode);
      const amount = parseFloat(order.totalAmount.toString());

      if (existing) {
        existing.count += 1;
        existing.totalAmount += amount;
      } else {
        paymentSummaryMap.set(order.paymentMode, {
          paymentMode: order.paymentMode,
          count: 1,
          totalAmount: amount,
        });
      }
    });

    const paymentSummary = Array.from(paymentSummaryMap.values());

    res.json(paymentSummary);
  } catch (error) {
    sendApiError(res, error, 'Payment summary report error:', 'Failed to generate payment summary report');
  }
});

export default router;
