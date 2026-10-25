import { beforeEach, describe, expect, it, vi } from 'vitest';

const { productFindMany, orderCreate, orderFindUnique, orderUpdate } = vi.hoisted(() => ({
  productFindMany: vi.fn(),
  orderCreate: vi.fn(),
  orderFindUnique: vi.fn(),
  orderUpdate: vi.fn(),
}));

vi.mock('../prisma', () => ({
  prisma: {
    product: { findMany: productFindMany },
    order: { create: orderCreate, findUnique: orderFindUnique, update: orderUpdate },
  },
}));

import request from 'supertest';
import { app } from '../index';

describe('Order business rules', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    productFindMany.mockResolvedValue([{ id: 7, isActive: true, price: { toString: () => '12.50' } }]);
  });

  it('uses database prices instead of client prices and totals the order on the server', async () => {
    orderCreate.mockImplementation(async ({ data }) => ({
      id: 1,
      ...data,
      orderItems: data.orderItems.create.map((item: { productId: number; quantity: number; price: number }) => ({
        ...item,
        product: { id: item.productId, name: 'Tea' },
      })),
    }));

    const response = await request(app).post('/api/orders').send({
      items: [{ productId: 7, quantity: 3, price: 0.01 }],
      totalAmount: 0.03,
      paymentMode: 'CASH',
    });

    expect(response.status).toBe(201);
    expect(orderCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        totalAmount: 37.5,
        orderItems: { create: [{ productId: 7, quantity: 3, price: 12.5 }] },
      }),
    }));
  });

  it('rejects zero quantities before persisting an order', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [{ productId: 7, quantity: 0 }],
      paymentMode: 'CASH',
    });

    expect(response.status).toBe(400);
    expect(orderCreate).not.toHaveBeenCalled();
  });

  it('rejects invalid order status transitions', async () => {
    orderFindUnique.mockResolvedValue({ id: 1, status: 'PENDING' });

    const response = await request(app).patch('/api/orders/1').send({ status: 'READY' });

    expect(response.status).toBe(400);
    expect(orderUpdate).not.toHaveBeenCalled();
  });
});
