import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import reportsRouter from './routes/reports';
import usersRouter from './routes/users';
import tablesRouter from './routes/tables';
import { prisma } from './prisma';
import { sendApiError } from './apiError';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tables', tablesRouter);

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    sendApiError(res, error, 'Database health check failed:', 'Database health check failed');
  }
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Export app for testing
export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}
