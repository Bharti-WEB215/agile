import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('Health Check', () => {
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
