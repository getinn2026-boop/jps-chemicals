import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Force Prisma to use the standard connection string directly
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
} as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}