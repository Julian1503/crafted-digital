import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please add it to your .env file or environment configuration."
    );
  }
  return url;
}

/**
 * Pool settings: the hosted Postgres closes idle connections, and a pooled
 * client that reuses a dead socket surfaces as Prisma P1017. Keep idle
 * connections short-lived, bound the pool, and fail fast on connect.
 */
const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
  max: Number(process.env.DATABASE_POOL_MAX ?? 5),
  idleTimeoutMillis: 20_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
