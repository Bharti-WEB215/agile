import { beforeEach, describe, it, expect, vi } from 'vitest';

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }));

vi.mock('../prisma', () => ({
  prisma: { $queryRaw: queryRaw },
}));

import request from 'supertest';
import { app } from '../index';

describe('Health Check', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryRaw.mockResolvedValue([{ result: 1 }]);
  });

  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('database', 'connected');
    expect(res.body).toHaveProperty('timestamp');
  });
});
