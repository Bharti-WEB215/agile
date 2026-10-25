import { beforeEach, describe, expect, it, vi } from 'vitest';

const { tableFindUnique, orderFindMany } = vi.hoisted(() => ({
  tableFindUnique: vi.fn(),
  orderFindMany: vi.fn(),
}));

vi.mock('../prisma', () => ({
  prisma: {
    table: { findUnique: tableFindUnique },
    order: { findMany: orderFindMany },
  },
}));

import request from 'supertest';
import { app } from '../index';

describe('Table session summary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    tableFindUnique.mockResolvedValue({
      id: 4,
      tableNo: '4',
      qrToken: 'table-token',
      isActive: true,
      lastSettledAt: new Date('2026-10-01T00:00:00.000Z'),
    });
    orderFindMany.mockResolvedValue([
      { id: 1, totalAmount: { toString: () => '10.00' } },
      { id: 2, totalAmount: { toString: () => '15.50' } },
    ]);
  });

  it('returns the active-session orders and their combined total', async () => {
    const response = await request(app).get('/api/tables/table-token/session');

    expect(response.status).toBe(200);
    expect(response.body.orderCount).toBe(2);
    expect(response.body.totalAmount).toBe(25.5);
    expect(orderFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        tableId: 4,
        source: 'QR',
        createdAt: { gt: new Date('2026-10-01T00:00:00.000Z') },
      }),
    }));
  });
});
