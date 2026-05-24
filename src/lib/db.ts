import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Prevent multiple instances of Prisma Client from freezing the database in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Establishing a native database communication connection pool
const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

// Wrapping the database pool in the prisma v7 Driver Adapter
const adapter = new PrismaPg(pool);

// Initiates a Prisma Client instance with the adapter, or reuses the existing one in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.Node_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
