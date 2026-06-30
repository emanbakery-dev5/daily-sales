/**
 * Zod Validation Schemas — Authentication Module
 * ============================================================
 * Server-side input validation schemas for all authentication
 * Server Actions. These run BEFORE any Supabase calls.
 *
 * Uses Zod v4. In v4, `required_error` was removed; use a
 * `.min(1, message)` or `.nonempty(message)` pattern instead.
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §8, §17, §19
 *   - docs/functional-specification/ERROR_HANDLING.md §9
 * ============================================================
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared field validators (Zod v4 compatible)
// ---------------------------------------------------------------------------

const emailField = z
  .string()
  .trim()
  .min(1, "Please enter a valid email address.")
  .max(255, "Email address must not exceed 255 characters.")
  .email("Please enter a valid email address.");

const passwordField = z
  .string()
  .min(1, "Password is required.")
  .refine((val) => val.trim().length > 0, {
    message: "Password is required.",
  });

// ---------------------------------------------------------------------------
// loginSchema — AUTHENTICATION.md §8
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// forgotPasswordSchema — AUTHENTICATION.md §17
// ---------------------------------------------------------------------------

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ---------------------------------------------------------------------------
// resetPasswordSchema — AUTHENTICATION.md §19
// Password rules:
//   - Minimum 8 characters
//   - At least one uppercase letter
//   - At least one lowercase letter
//   - At least one digit
//   - confirmPassword must exactly match newPassword
// ---------------------------------------------------------------------------

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/[0-9]/, "Password must include at least one number."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ---------------------------------------------------------------------------
// parseFormData — utility to extract and parse a FormData object with Zod
// ---------------------------------------------------------------------------

/**
 * Parses raw FormData against a Zod schema.
 * Returns `{ success: true, data }` or `{ success: false, fieldErrors }`.
 */
export function parseFormData<T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData,
):
  | { success: true; data: z.infer<T> }
  | { success: false; fieldErrors: Record<string, string[]> } {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: Record<string, string[]> = {};
  const flat = result.error.flatten();
  for (const [field, messages] of Object.entries(flat.fieldErrors)) {
    const msgs = messages as string[] | undefined;
    if (msgs && msgs.length > 0) {
      fieldErrors[field] = msgs;
    }
  }

  return { success: false, fieldErrors };
}
