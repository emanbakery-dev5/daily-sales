"use server";

import { requirePermission } from "@/lib/permissions/guard";
import {
  AppError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { DATA_ERRORS, NOT_FOUND_ERROR } from "@/lib/errors/error-codes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { z } from "zod";

const getStatementSchema = z.object({
  id: z.string().uuid("Invalid Salesperson ID"),
});

export async function getSalespersonStatementAction(
  data: z.infer<typeof getStatementSchema>,
) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    await requirePermission("Salesperson.View");

    // 2. Validate Input
    const parsed = getStatementSchema.safeParse(data);
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
    const { data: salesperson, error: dbError } = await supabase
      .from("salesperson_profiles")
      .select(
        "id, employee_code, first_name, last_name, status, credit_limit, current_balance, updated_at",
      )
      .eq("id", validated.id)
      .single();

    if (dbError || !salesperson) {
      throw new AppError(NOT_FOUND_ERROR, correlationId, dbError);
    }

    // In a future phase when the Ledger module is implemented, this function could also
    // fetch transactions related to this salesperson and return them as part of the statement.

    const statement = {
      profile: salesperson,
      balance: salesperson.current_balance,
      creditLimit: salesperson.credit_limit,
      availableCredit: Math.max(
        0,
        salesperson.credit_limit - salesperson.current_balance,
      ),
      transactions: [], // Placeholder for ledger entries
    };

    return createActionSuccess(statement, correlationId);
  });
}
