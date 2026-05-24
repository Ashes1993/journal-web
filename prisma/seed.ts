import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Establishing a native database communication connection pool
const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

// Wrapping the database pool in the prisma v7 Driver Adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Wipe existing data
  await prisma.user.deleteMany();

  // Create a test user with nested journal entries
  const testUser = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      entries: {
        create: [
          {
            title: "First Day with TypeScript",
            content:
              "Today I started learning TypeScript. It has been a great experience so far!",
            mood: "Excited",
            tags: ["learning", "typescript", "programming"],
          },
          {
            title: "Debugging",
            content:
              "Hit a permission error with linux, but figured out how to bypass it",
            mood: "Focused",
            tags: ["debugging", "linux", "permissions"],
          },
        ],
      },
    },
  });

  console.log(`Created user: ${testUser.name} with email: ${testUser.email}`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
