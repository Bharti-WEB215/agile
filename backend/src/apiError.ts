import { Response } from 'express';

const DATABASE_UNAVAILABLE_CODES = new Set(['P1000', 'P1001', 'P1002', 'P1003', 'P1017']);

function isDatabaseUnavailable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  const candidate = error as {
    code?: unknown;
    name?: unknown;
    message?: unknown;
    constructor?: { name?: unknown };
  };
  return (
    candidate.name === 'PrismaClientInitializationError' ||
    candidate.constructor?.name === 'PrismaClientInitializationError' ||
    (typeof candidate.code === 'string' && DATABASE_UNAVAILABLE_CODES.has(candidate.code)) ||
    /PrismaClientInitializationError|P1001|can't reach database server|connection refused/i.test(message) ||
    (typeof candidate.message === 'string' && /can't reach database server|connection refused/i.test(candidate.message))
  );
}

export function sendApiError(
  response: Response,
  error: unknown,
  context: string,
  fallbackMessage: string
): void {
  console.error(context, error);

  if (isDatabaseUnavailable(error)) {
    response.status(503).json({
      error: 'Database unavailable. Start or reconnect PostgreSQL, then retry.',
    });
    return;
  }

  response.status(500).json({ error: fallbackMessage });
}
