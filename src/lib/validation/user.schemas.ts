import { z } from "zod";
import { UserRole, UserStatus } from "@/lib/types/auth.types";

/**
 * Validates creating a new user profile.
 */
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters")
    .max(100, "First Name cannot exceed 100 characters")
    .trim()
    .regex(/^[a-zA-Z\s\-']+$/, "First Name cannot contain numbers or special characters"),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters")
    .max(100, "Last Name cannot exceed 100 characters")
    .trim()
    .regex(/^[a-zA-Z\s\-']+$/, "Last Name cannot contain numbers or special characters"),
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_\.]+$/, "Username can only contain letters, numbers, underscores, and periods"),
  phone: z
    .string()
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^\+?[\d\s\-]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Invalid role selected" }) }),
  requirePasswordChange: z.boolean().default(true),
});

export type CreateUser = z.infer<typeof createUserSchema>;

/**
 * Validates updating an existing user profile (non-sensitive fields).
 */
export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters")
    .max(100, "First Name cannot exceed 100 characters")
    .trim()
    .regex(/^[a-zA-Z\s\-']+$/, "First Name cannot contain numbers or special characters"),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters")
    .max(100, "Last Name cannot exceed 100 characters")
    .trim()
    .regex(/^[a-zA-Z\s\-']+$/, "Last Name cannot contain numbers or special characters"),
  phone: z
    .string()
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^\+?[\d\s\-]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

/**
 * Validates updating user status.
 */
export const updateUserStatusSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  status: z.nativeEnum(UserStatus, { errorMap: () => ({ message: "Invalid status selected" }) }),
});

export type UpdateUserStatus = z.infer<typeof updateUserStatusSchema>;

/**
 * Validates assigning a role to a user.
 */
export const assignUserRoleSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Invalid role selected" }) }),
});

export type AssignUserRole = z.infer<typeof assignUserRoleSchema>;
