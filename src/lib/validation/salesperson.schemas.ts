import { z } from "zod";

export const salespersonStatusEnum = z.enum(["active", "inactive"]);

export const createSalespersonSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters")
    .max(100, "First Name cannot exceed 100 characters")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters")
    .max(100, "Last Name cannot exceed 100 characters")
    .trim(),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation cannot exceed 100 characters")
    .trim(),
  mobileNumber: z
    .string()
    .max(20, "Mobile number cannot exceed 20 characters")
    .regex(/^\+?[\d\s\-]+$/, "Invalid mobile number format")
    .trim(),
  emailAddress: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Address cannot exceed 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  dateJoined: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD")
    .optional(),
  creditLimit: z
    .number()
    .min(0, "Credit limit must be a positive number")
    .optional(),
  status: salespersonStatusEnum.optional(),
});

export type CreateSalesperson = z.infer<typeof createSalespersonSchema>;

export const updateSalespersonSchema = createSalespersonSchema.extend({
  id: z.string().uuid("Invalid Salesperson ID"),
});

export type UpdateSalesperson = z.infer<typeof updateSalespersonSchema>;

export const adjustCreditLimitSchema = z.object({
  id: z.string().uuid("Invalid Salesperson ID"),
  newCreditLimit: z.number().min(0, "Credit limit must be a positive number"),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500)
    .trim(),
});

export type AdjustCreditLimit = z.infer<typeof adjustCreditLimitSchema>;

export const updateSalespersonStatusSchema = z.object({
  id: z.string().uuid("Invalid Salesperson ID"),
  status: salespersonStatusEnum,
});

export type UpdateSalespersonStatus = z.infer<
  typeof updateSalespersonStatusSchema
>;
