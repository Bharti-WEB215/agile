import { PrismaClient } from '../src/generated/local-client';

const prisma = new PrismaClient();

async function main() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS "users" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "products" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "price" REAL NOT NULL,
      "category" TEXT,
      "is_active" BOOLEAN NOT NULL DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS "tables" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "table_no" TEXT NOT NULL,
      "qr_token" TEXT NOT NULL,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "last_settled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "tables_table_no_key" UNIQUE ("table_no"),
      CONSTRAINT "tables_qr_token_key" UNIQUE ("qr_token")
    )`,
    `CREATE TABLE IF NOT EXISTS "orders" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "order_number" TEXT NOT NULL,
      "total_amount" REAL NOT NULL,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "payment_mode" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "source" TEXT NOT NULL DEFAULT 'CASHIER',
      "table_id" INTEGER,
      CONSTRAINT "orders_order_number_key" UNIQUE ("order_number"),
      CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "order_items" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "order_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      "quantity" INTEGER NOT NULL,
      "price" REAL NOT NULL,
      CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
  ];

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
  console.log('Local SQLite database is ready.');
}

main()
  .catch((error) => {
    console.error('Could not initialize local SQLite database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
