import "dotenv/config";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma 7 requires a database adapter.
 * This adapter connects Prisma to our PostgreSQL database.
 */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

/**
 * Prevents multiple Prisma instances during development.
 * Next.js hot reload can otherwise create too many connections.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Shared Prisma client used across the app.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
