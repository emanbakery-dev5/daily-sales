import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // It will use env vars from .env.local if loaded, or we fallback
);

test.describe("Dashboard Module E2E", () => {
  const testEmail = `admin_${crypto.randomBytes(4).toString("hex")}@ema.local`;
  const testPassword = "AdminPassword123!";
  let userId: string;

  test.beforeAll(async () => {
    // We create a user for testing using the Admin API
    const { data: authData, error: authErr } =
      await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      });

    if (authErr) {
      console.warn(
        "Failed to create test user (might be missing service key in CI)",
        authErr,
      );
      return;
    }
    userId = authData.user.id;

    // Wait for trigger to create user_profile, then update role
    const { error: updateErr } = await supabase
      .from("user_profiles")
      .update({ role: "system_administrator", status: "active" })
      .eq("id", userId);
    if (updateErr) {
      console.warn("Failed to update test user role", updateErr);
    }
  });

  test.afterAll(async () => {
    if (userId) {
      await supabase.auth.admin.deleteUser(userId);
    }
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    // Should be redirected to /login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test.skip("authenticated admin can view dashboard and widgets", async ({
    page,
  }) => {
    test.skip(!userId, "Skipping because test user creation failed");

    // Login
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Email Address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Sign In" }).click({ force: true });

    // Verify redirection to dashboard
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Check Header
    await expect(page.locator("text=Good")).toBeVisible();
    await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();

    // Check KPI Grid
    await expect(page.locator("text=Today's Dispatches")).toBeVisible();
    await expect(page.locator("text=Today's Revenue")).toBeVisible();
    await expect(page.locator("text=Payments Received")).toBeVisible();
    await expect(page.locator("text=Outstanding Balance")).toBeVisible();

    // Check Charts rendering
    await expect(page.locator("text=Revenue Trend")).toBeVisible();
    await expect(page.locator("text=Daily Dispatches")).toBeVisible();

    // Check other widgets
    await expect(page.locator("text=Top Outstanding Balances")).toBeVisible();
    await expect(page.locator("text=Recent Activity")).toBeVisible();
    await expect(page.locator("text=Quick Actions")).toBeVisible();

    // Verify Quick Actions has admin links
    await expect(
      page.getByRole("link", { name: "New Dispatch" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Record Payment" }),
    ).toBeVisible();
  });
});
