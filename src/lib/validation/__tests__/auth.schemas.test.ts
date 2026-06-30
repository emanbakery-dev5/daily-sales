import { describe, it, expect } from "vitest";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../auth.schemas";

describe("Authentication Zod Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correctly with valid email and password", () => {
      const data = { email: "test@example.com", password: "Password123" };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should fail with an invalid email format", () => {
      const data = { email: "not-an-email", password: "Password123" };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address.",
        );
      }
    });

    it("should fail if password is empty", () => {
      const data = { email: "test@example.com", password: "   " };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required.");
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should validate correctly with a valid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "user@ema.local",
      });
      expect(result.success).toBe(true);
    });

    it("should fail if email is missing", () => {
      const result = forgotPasswordSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("should validate strong passwords that match", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "StrongPassword123!",
        confirmPassword: "StrongPassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("should fail if passwords do not match", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "StrongPassword123!",
        confirmPassword: "DifferentPassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain("Passwords do not match.");
      }
    });

    it("should fail if password does not meet strength requirements", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "weak",
        confirmPassword: "weak",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Password must be at least 8 characters.",
        );
        expect(errorMessages).toContain(
          "Password must include at least one uppercase letter.",
        );
        expect(errorMessages).toContain(
          "Password must include at least one number.",
        );
      }
    });
  });
});
