import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('Input Validation', () => {
  describe('Products', () => {
    it('GET /api/products/abc should return 400 for invalid ID', async () => {
      const res = await request(app).get('/api/products/abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid product ID');
    });

    it('POST /api/products should return 400 without required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test' });
      expect(res.status).toBe(400);
    });

    it('POST /api/products should return 400 for negative price', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test', price: -10, category: 'Test' });
      expect(res.status).toBe(400);
    });
  });

  describe('Orders', () => {
    it('GET /api/orders/abc should return 400 for invalid ID', async () => {
      const res = await request(app).get('/api/orders/abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid order ID');
    });

    it('POST /api/orders should return 400 without items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ paymentMode: 'CASH' });
      expect(res.status).toBe(400);
    });

    it('POST /api/orders should return 400 without payment mode', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ items: [{ productId: 1, quantity: 1 }] });
      expect(res.status).toBe(400);
    });

    it('POST /api/orders should return 400 for invalid payment mode', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ items: [{ productId: 1, quantity: 1 }], paymentMode: 'BITCOIN' });
      expect(res.status).toBe(400);
    });
  });

  describe('Tables', () => {
    it('PATCH /api/tables/abc should return 400 for invalid ID', async () => {
      const res = await request(app)
        .patch('/api/tables/abc')
        .send({ isActive: true });
      expect(res.status).toBe(400);
    });

    it('DELETE /api/tables/abc should return 400 for invalid ID', async () => {
      const res = await request(app).delete('/api/tables/abc');
      expect(res.status).toBe(400);
    });
  });

  describe('Reports', () => {
    it('GET /api/reports/daily-sales should return 400 for invalid date', async () => {
      const res = await request(app).get('/api/reports/daily-sales?date=not-a-date');
      expect(res.status).toBe(400);
    });
  });
});
