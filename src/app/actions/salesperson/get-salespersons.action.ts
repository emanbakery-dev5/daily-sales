"use server";

import { requirePermission } from "@/lib/permissions/guard";
import {
  AppError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { DATA_ERRORS } from "@/lib/errors/error-codes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { z } from "zod";

const getSalespersonsSchema = z.object({
  status: z.enum(["active", "inactive"]).optional(),
  search: z.string().optional(),
});

export async function getSalespersonsAction(
  data: z.infer<typeof getSalespersonsSchema> = {},
) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    await requirePermission("Salesperson.View");

    // 2. Validate Input
    const parsed = getSalespersonsSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        DATA_ERRORS.VALIDATION_ERROR,
        correlationId,
        parsed.error.message,
      );
    }
    const validated = parsed.data;

    const supabase = await createSupabaseServerClient();

    // 3. Fetch Data
    let query = supabase
      .from("salesperson_profiles")
      .select("*")
      .order("first_name", { ascending: true });

    if (validated.status) {
      query = query.eq("status", validated.status);
    }

    if (validated.search) {
      query = query.or(
        `first_name.ilike.%${validated.search}%,last_name.ilike.%${validated.search}%,employee_code.ilike.%${validated.search}%`,
      );
    }

    const { data: salespersons, error: dbError } = await query;

    if (dbError) {
      throw new AppError(DATA_ERRORS.DATABASE_ERROR, correlationId, dbError);
    }

    return createActionSuccess(salespersons, correlationId);
  });
}
