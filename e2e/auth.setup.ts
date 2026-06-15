import "dotenv/config"; // Senior Requirement: Hydrate process.env before initializing the connection pool
import { test as setup } from "@playwright/test";
import { Pool } from "pg";
import { TEST_USER_ID, TEST_USER_EMAIL } from "./constants";

const authFile = "playwright/.auth/user.json";

setup("Authenticate via Environment Backdoor", async ({ page }) => {
  // 1. ISOLATED DATABASE SEEDING
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query(
      `
      INSERT INTO "User" (id, email, name, "defaultMood", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name;
    `,
      [TEST_USER_ID, TEST_USER_EMAIL, "Test User", "neutral"],
    );
  } catch (dbError) {
    console.error(
      "Database seed failed during isolated E2E initialization:",
      dbError,
    );
    throw dbError;
  } finally {
    await pool.end();
  }

  // 2. BROWSER AUTHENTICATION PHASE
  await page.goto("/api/auth/signin");

  await page.fill('input[name="email"]', TEST_USER_EMAIL);
  await page.fill('input[name="password"]', "password123");
  await page.locator('input[name="password"]').press("Enter");

  await page.waitForURL("**/");
  await page.context().storageState({ path: authFile });
});
