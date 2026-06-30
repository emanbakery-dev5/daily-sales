import { test, expect } from "@playwright/test";

test.describe("Password Reset Flow", () => {
  test("forgot password page accepts email and shows success", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Email Address").fill("test@ema.local");
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    // Wait for the success state (toast and UI change)
    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText("Password reset instructions sent");

    // UI should update to show the confirmation
    await expect(page.getByText("Check your email")).toBeVisible();
    await expect(
      page.getByText("We've sent password reset instructions"),
    ).toBeVisible();
  });

  test("reset password page enforces password match", async ({ page }) => {
    await page.goto("/reset-password");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("New Password").fill("StrongPass123!");
    await page.getByLabel("Confirm Password").fill("DifferentPass123!");

    await page.getByRole("button", { name: "Reset Password" }).click();

    // Client-side or Server-side mismatch should show a toast
    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Passwords do not match");
  });
});
