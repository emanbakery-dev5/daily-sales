import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
  });

  test("displays validation errors for invalid input", async ({ page }) => {
    // Attempt to submit empty form
    await page.getByRole("button", { name: "Sign In" }).click();

    // HTML5 validation should block submission if fields are required
    // If not, our Zod schemas catch it. We can test client-side validation by checking the input state
    const emailInput = page.getByLabel("Email Address");
    await expect(emailInput).toHaveAttribute("required", "");
  });

  test("displays error toast on invalid credentials", async ({ page }) => {
    await page.getByLabel("Email Address").fill("invalid@ema.local");
    await page.getByLabel("Password").fill("WrongPassword123!");

    await page.getByRole("button", { name: "Sign In" }).click();

    // The Server Action will return an error because the user doesn't exist
    // We expect a toast notification to appear
    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toBeVisible({ timeout: 15000 });
    // It will either say "Invalid login credentials" (from Supabase), "Authentication failed", or "Invalid email or password."
    await expect(toast).toContainText(
      /(Invalid login credentials|Authentication failed|Invalid email or password\.)/,
    );
  });

  test("navigates to forgot password page", async ({ page }) => {
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await page.waitForURL("**/forgot-password", { timeout: 15000 });
    await expect(page).toHaveURL(/.*\/forgot-password/);
  });
});
