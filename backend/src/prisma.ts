import { PrismaClient } from '@prisma/client';
import { PrismaClient as LocalPrismaClient } from './generated/local-client';

const isLocalSqlite = process.env.DATABASE_URL?.startsWith('file:') ?? false;
const log = process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] as const : ['error'] as const;

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (isLocalSqlite
    ? (new LocalPrismaClient({ log: [...log] }) as unknown as PrismaClient)
    : new PrismaClient({ log: [...log] }));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
