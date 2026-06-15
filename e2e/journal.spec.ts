import "dotenv/config";
import { test, expect } from "@playwright/test";
import { Pool } from "pg";
import { TEST_USER_ID } from "./constants";

test.describe("Journal Application E2E Core Platform Validation", () => {
  // Isolated Database Teardown Hook
  test.afterEach(async () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
      await pool.query('DELETE FROM "Entry" WHERE "userId" = $1', [
        TEST_USER_ID,
      ]);
    } catch (error) {
      console.error(
        "Teardown Warning: Failed to sweep database test records:",
        error,
      );
    } finally {
      await pool.end();
    }
  });

  test("Should successfully execute a full journal entry creation lifecycle", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "My Journal", level: 1 }),
    ).toBeVisible();

    const modalTrigger = page
      .getByRole("button", { name: /add|new|create|write/i })
      .first();
    await modalTrigger.click();

    await page.getByPlaceholder("Give it a title...").fill("E2E Test Journey");
    await page
      .getByPlaceholder("What's on your mind?")
      .fill(
        "Writing data layers directly to database via Playwright browser interaction.",
      );

    await page.getByText("🤩").click();

    const tagInput = page.getByPlaceholder("Add tag...");
    await tagInput.fill("playwright-automation");
    await tagInput.press("Enter");

    await expect(page.getByText("#playwright-automation")).toBeVisible();

    await page.getByRole("button", { name: "SAVE MEMORY" }).click();

    await expect(page.getByText("E2E Test Journey")).toBeVisible();
    await expect(
      page.getByText(
        "Writing data layers directly to database via Playwright browser interaction.",
      ),
    ).toBeVisible();
  });
});
