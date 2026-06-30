/**
 * AppError — Application Error Class and Factory
 * ============================================================
 * Provides a typed exception class and a factory function
 * (`createActionError`) that converts an error code definition
 * into a standardised `ActionResult<never>` failure payload.
 *
 * Aligned with:
 *   - docs/functional-specification/ERROR_HANDLING.md §5, §20
 * ============================================================
 */

import { randomUUID } from "crypto";
import type {
  ActionResult,
  ActionError,
  ErrorCategory,
} from "@/lib/types/auth.types";
import type { ErrorCodeDefinition } from "./error-codes";

// ---------------------------------------------------------------------------
// AppError — a typed Error subclass that carries structured error metadata
// ---------------------------------------------------------------------------

export class AppError extends Error {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly userMessage: string;
  public readonly httpStatus: number;
  public readonly correlationId: string;
  public readonly timestamp: string;

  constructor(definition: ErrorCodeDefinition, correlationId?: string) {
    super(definition.message);
    this.name = "AppError";
    this.code = definition.code;
    this.category = definition.category;
    this.userMessage = definition.message;
    this.httpStatus = definition.httpStatus;
    this.correlationId = correlationId ?? randomUUID();
    this.timestamp = new Date().toISOString();
  }

  /** Converts this AppError into an ActionResult failure. */
  toActionResult(): ActionResult<never> {
    return {
      success: false,
      error: this.toActionError(),
    };
  }

  toActionError(): ActionError {
    return {
      code: this.code,
      category: this.category,
      message: this.userMessage,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
      httpStatus: this.httpStatus,
    };
  }
}

// ---------------------------------------------------------------------------
// createActionError — convenience factory for inline failure returns
// ---------------------------------------------------------------------------

/**
 * Creates a failed `ActionResult` from an error code definition.
 *
 * Usage:
 *   return createActionError(AUTH_ERRORS.INVALID_CREDENTIALS);
 *   return createActionError(AUTH_ERRORS.PERMISSION_DENIED, existingCorrelationId);
 */
export function createActionError<T>(
  definition: ErrorCodeDefinition,
  correlationId?: string,
): ActionResult<T> {
  const err = new AppError(definition, correlationId);
  return {
    success: false,
    error: err.toActionError(),
  };
}

// ---------------------------------------------------------------------------
// createActionSuccess — convenience factory for successful returns
// ---------------------------------------------------------------------------

export function createActionSuccess<T>(
  data: T,
  correlationId?: string,
): ActionResult<T> {
  return {
    success: true,
    data,
    correlationId: correlationId ?? randomUUID(),
  };
}

// ---------------------------------------------------------------------------
// safeServerAction — wraps any async Server Action body in a try/catch
// that converts unexpected errors into AUTH-099 INTERNAL_ERROR results
// ---------------------------------------------------------------------------

import { AUTH_ERRORS } from "./error-codes";

export async function safeServerAction<T>(
  correlationId: string,
  fn: () => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (err) {
    // Log on the server only — never forward stack traces to the client
    console.error(`[safeServerAction] correlationId=${correlationId}`, err);
    return createActionError<T>(AUTH_ERRORS.INTERNAL_ERROR, correlationId);
  }
}
