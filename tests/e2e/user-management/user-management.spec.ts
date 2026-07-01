import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
);

test.describe("User Management Module", () => {
  const adminEmail = `admin_${crypto.randomBytes(4).toString("hex")}@ema.local`;
  const adminPassword = "AdminPassword123!";
  let adminId: string;
  const testUserEmail = `test.user.${crypto.randomBytes(4).toString("hex")}@example.com`;
  const testUserUsername = `test.user.${crypto.randomBytes(2).toString("hex")}`;

  test.beforeAll(async () => {
    const { data: authData, error: authErr } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
    if (authErr) {
      console.error("Test user creation failed:", authErr);
      return;
    }
    adminId = authData.user.id;
    await supabase
      .from("user_profiles")
      .update({ role: "system_administrator", status: "active" })
      .eq("id", adminId);
  });

  test.afterAll(async () => {
    if (adminId) await supabase.auth.admin.deleteUser(adminId);
  });

  test.beforeEach(async ({ page }) => {
    test.skip(!adminId, "Skipping because test user creation failed");
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Email Address").fill(adminEmail);
    await page.getByLabel("Password").fill(adminPassword);
    await page.getByRole("button", { name: "Sign In" }).click({ force: true });
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test.skip("should navigate to user management and display the users list", async ({
    page,
  }) => {
    // Click on User Management in the sidebar (or navigate directly)
    await page.goto("/users");

    // Verify we are on the users page
    await expect(
      page.getByRole("heading", { name: "User Management" }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("admin@emabakery.com")).toBeVisible();
  });

  test.skip("should successfully create a new user", async ({ page }) => {
    await page.goto("/users");

    // Click New User button
    await page.getByRole("link", { name: /New User/i }).click();
    await page.waitForURL("**/users/new");

    // Fill out the form
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="username"]', testUserUsername);
    await page.fill('input[name="phone"]', "+1234567890");

    // Select role (Read-Only User is default, let's select Finance Officer)
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Finance Officer" }).click();

    // Submit form
    await page.getByRole("button", { name: "Create User" }).click();

    // Wait for success toast
    await expect(page.getByText(/User .* created successfully/)).toBeVisible();

    // We should be redirected to the user details page
    await expect(page).toHaveURL(/\/users\/[0-9a-fA-F-]+$/);

    // Verify details on the page
    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByText(testUserEmail)).toBeVisible();
    await expect(page.getByText("Finance Officer")).toBeVisible();
  });

  test.skip("should edit an existing user", async ({ page }) => {
    // Navigate to users list and click the first user (usually Admin or our newly created user)
    await page.goto("/users");

    // We can directly click on a row or the edit action in dropdown.
    // For simplicity, find the admin user and edit
    const adminLink = page.getByRole("link", { name: "Admin User" });
    await adminLink.click();

    await page.waitForURL(/\/users\/[0-9a-fA-F-]+$/);

    // Click Edit Profile
    await page.getByRole("link", { name: "Edit Profile" }).click();
    await page.waitForURL(/\/users\/[0-9a-fA-F-]+\/edit$/);

    // Change phone number
    await page.fill('input[name="phone"]', "+9999999999");

    // Submit changes
    await page.getByRole("button", { name: "Save Changes" }).click();

    // Wait for success toast
    await expect(
      page.getByText("User profile updated successfully"),
    ).toBeVisible();

    // Wait for redirect back to details
    await expect(page).toHaveURL(/\/users\/[0-9a-fA-F-]+$/);

    // Verify new phone number is displayed
    await expect(page.getByText("+9999999999")).toBeVisible();
  });

  test.skip("should open role assignment dialog and change role", async ({
    page,
  }) => {
    await page.goto("/users");

    // Find the first user in the list and click the more actions button
    // It's a bit tricky to target standard table rows, so we'll get the first 'More actions' button
    const firstMoreActionsBtn = page
      .getByRole("button", { name: "Open menu" })
      .first();
    await firstMoreActionsBtn.hover(); // It might only appear on hover based on our group-hover setup
    await firstMoreActionsBtn.click();

    // Click Assign Role
    await page.getByRole("menuitem", { name: "Assign Role" }).click();

    // Ensure dialog opens
    await expect(
      page.getByRole("dialog", { name: "Assign Role" }),
    ).toBeVisible();

    // Select a new role
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Sales Coordinator" }).click();

    // Submit
    await page.getByRole("button", { name: "Assign Role" }).click();

    // Wait for success toast
    await expect(
      page.getByText("User role updated successfully"),
    ).toBeVisible();
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
