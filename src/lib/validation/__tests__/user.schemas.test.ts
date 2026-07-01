import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "../user.schemas";
import { UserRole } from "../../types/auth.types";

describe("User Management Schemas", () => {
  describe("createUserSchema", () => {
    it("should accept valid user creation payload", () => {
      const validPayload = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        username: "jane.doe",
        phone: "+1234567890",
        role: UserRole.FINANCE_OFFICER,
        requirePasswordChange: true,
      };

      const result = createUserSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidPayload = {
        firstName: "Jane",
        lastName: "Doe",
        email: "not-an-email",
        username: "jane.doe",
        role: UserRole.READ_ONLY_USER,
      };

      const result = createUserSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });

    it("should reject missing required fields", () => {
      const invalidPayload = {
        email: "jane.doe@example.com",
      };

      const result = createUserSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const fields = result.error.issues.map((i) => i.path[0]);
        expect(fields).toContain("firstName");
        expect(fields).toContain("lastName");
        expect(fields).toContain("username");
        expect(fields).toContain("role");
      }
    });

    it("should reject invalid roles", () => {
      const invalidPayload = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        username: "jane.doe",
        role: "INVALID_ROLE",
      };

      const result = createUserSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("updateUserSchema", () => {
    it("should accept valid update payload", () => {
      const validPayload = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        firstName: "Jane",
        lastName: "Smith",
        phone: "+0987654321",
      };

      const result = updateUserSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject empty names", () => {
      const invalidPayload = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        firstName: "",
        lastName: "",
      };

      const result = updateUserSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (i) => i.message === "First Name must be at least 2 characters",
          ),
        ).toBe(true);
      }
    });
  });
});
