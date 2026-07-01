import { describe, it, expect } from "vitest";
import {
  createSalespersonSchema,
  adjustCreditLimitSchema,
} from "../salesperson.schemas";

describe("Salesperson Validation Schemas", () => {
  describe("createSalespersonSchema", () => {
    it("should validate a correct salesperson payload", () => {
      const validPayload = {
        firstName: "John",
        lastName: "Doe",
        designation: "Senior Rep",
        mobileNumber: "+1 555-1234",
        emailAddress: "john.doe@example.com",
        address: "123 Sales Ave",
        creditLimit: 5000.0,
      };

      const result = createSalespersonSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject negative credit limits", () => {
      const invalidPayload = {
        firstName: "John",
        lastName: "Doe",
        designation: "Senior Rep",
        mobileNumber: "+1 555-1234",
        creditLimit: -100, // Invalid
      };

      const result = createSalespersonSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Credit limit must be a positive number",
        );
      }
    });

    it("should reject names that are too short", () => {
      const invalidPayload = {
        firstName: "J", // Too short
        lastName: "Doe",
        designation: "Senior Rep",
        mobileNumber: "+1 555-1234",
      };

      const result = createSalespersonSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "First Name must be at least 2 characters",
        );
      }
    });

    it("should allow empty email or address", () => {
      const validPayload = {
        firstName: "John",
        lastName: "Doe",
        designation: "Rep",
        mobileNumber: "12345",
        emailAddress: "",
        address: "",
      };

      const result = createSalespersonSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });
  });

  describe("adjustCreditLimitSchema", () => {
    it("should validate a correct adjustment payload", () => {
      const validPayload = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        newCreditLimit: 10000.0,
        reason: "Increased limit for holiday season",
      };

      const result = adjustCreditLimitSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject if reason is too short", () => {
      const invalidPayload = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        newCreditLimit: 10000.0,
        reason: "ok", // Too short
      };

      const result = adjustCreditLimitSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Reason must be at least 5 characters",
        );
      }
    });

    it("should reject invalid UUID", () => {
      const invalidPayload = {
        id: "invalid-uuid",
        newCreditLimit: 5000,
        reason: "Valid reason here",
      };

      const result = adjustCreditLimitSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
