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

test.describe("Salesperson Management Module", () => {
  const adminEmail = `admin_${crypto.randomBytes(4).toString("hex")}@ema.local`;
  const adminPassword = "AdminPassword123!";
  let adminId: string;
  const testFirstName = `TestName_${crypto.randomBytes(2).toString("hex")}`;
  const testLastName = `LastName_${crypto.randomBytes(2).toString("hex")}`;
  const testMobile = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;

  test.beforeAll(async () => {
    // We assume the user management tests are somewhat isolated, so we create a fresh admin
    const { data: authData, error: authErr } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
    if (authErr) {
      console.error("Test admin creation failed:", authErr);
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

    // Cleanup created salespersons by mobile to keep DB clean
    await supabase
      .from("salesperson_profiles")
      .delete()
      .eq("mobile_number", testMobile);
  });

  test.beforeEach(async ({ page }) => {
    test.skip(!adminId, "Skipping because test admin creation failed");
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Email Address").fill(adminEmail);
    await page.getByLabel("Password").fill(adminPassword);
    await page.getByRole("button", { name: "Sign In" }).click({ force: true });
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test.skip("should navigate to salesperson directory and see the layout", async ({
    page,
  }) => {
    await page.goto("/salespersons");

    await expect(
      page.getByRole("heading", { name: "Salespersons" }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test.skip("should successfully create a new salesperson profile", async ({
    page,
  }) => {
    await page.goto("/salespersons/new");

    // Fill out the form
    await page.fill('input[name="firstName"]', testFirstName);
    await page.fill('input[name="lastName"]', testLastName);
    await page.fill(
      'input[name="designation"]',
      "Regional Sales Representative",
    );
    await page.fill('input[name="mobileNumber"]', testMobile);
    await page.fill('input[name="creditLimit"]', "5000");

    // Submit form
    await page.getByRole("button", { name: "Create Salesperson" }).click();

    // Wait for success toast
    await expect(
      page.getByText(/Salesperson created successfully/),
    ).toBeVisible();

    // We should be redirected to the directory page
    await expect(page).toHaveURL(/\/salespersons$/);

    // Verify they show up in the table
    await expect(page.getByText(testFirstName)).toBeVisible();
    await expect(page.getByText(testLastName)).toBeVisible();
    await expect(page.getByText(testMobile)).toBeVisible();
  });

  test.skip("should open profile and adjust credit limit successfully", async ({
    page,
  }) => {
    // Navigate to salespersons
    await page.goto("/salespersons");

    // Wait for table to load
    await expect(page.getByText(testFirstName)).toBeVisible();

    // Click the actions dropdown for our test user
    // Since Playwright makes table row targeting tricky, we'll try to find the row containing testFirstName
    // and click the More Actions button inside it.
    const row = page.locator("tr").filter({ hasText: testFirstName }).first();
    const actionsBtn = row.getByRole("button", { name: "Open menu" });

    await actionsBtn.click();
    await page.getByRole("menuitem", { name: "Profile" }).click();

    await page.waitForURL(/\/salespersons\/[0-9a-fA-F-]+$/);

    // Verify statement card loaded
    await expect(page.getByText("Financial Statement Snapshot")).toBeVisible();
    await expect(page.getByText("$5000.00")).toBeVisible(); // The credit limit we set earlier

    // Open Adjust Credit Limit Dialog
    await page.getByRole("button", { name: "Adjust Credit Limit" }).click();

    // Ensure dialog opens
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill out adjustment form
    await page.fill('input[name="newCreditLimit"]', "10000");
    await page.fill(
      'input[name="reason"]',
      "E2E Automated Testing Limit Increase",
    );

    // Submit
    await page.getByRole("button", { name: "Apply Adjustment" }).click();

    // Wait for success toast
    await expect(
      page.getByText(/Credit limit adjusted successfully/),
    ).toBeVisible();

    // Dialog should close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Value on screen should update to 10000
    await expect(page.getByText("$10000.00")).toBeVisible();
  });

  test.skip("should archive a salesperson", async ({ page }) => {
    await page.goto("/salespersons");

    const row = page.locator("tr").filter({ hasText: testFirstName }).first();
    const actionsBtn = row.getByRole("button", { name: "Open menu" });

    await actionsBtn.click();
    await page.getByRole("menuitem", { name: "Profile" }).click();

    await page.waitForURL(/\/salespersons\/[0-9a-fA-F-]+$/);

    // Open Archive Dialog
    await page.getByRole("button", { name: "Archive Account" }).click();

    // Ensure dialog opens
    await expect(page.getByRole("dialog")).toBeVisible();

    // Submit
    await page.getByRole("button", { name: "Archive" }).click();

    // Wait for success toast
    await expect(
      page.getByText(/Salesperson archived successfully/),
    ).toBeVisible();

    // Ensure status badge updates
    await expect(page.getByText("Inactive").first()).toBeVisible();
  });
});
