"use server";

import { requirePermission } from "@/lib/permissions/guard";
import {
  AppError,
  createActionSuccess,
  safeServerAction,
} from "@/lib/errors/app-error";
import { AUTH_ERRORS } from "@/lib/errors/error-codes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { UserRole, UserStatus } from "@/lib/types/auth.types";

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
}

export async function getUsersAction(params: GetUsersParams = {}) {
  const correlationId = randomUUID();

  return safeServerAction(correlationId, async () => {
    // 1. Authorize Request
    await requirePermission("User.View");

    const supabase = await createSupabaseServerClient();

    let query = supabase.from("user_profiles").select("*", { count: "exact" });

    // 2. Apply Filters
    if (params.search) {
      // Very basic search, ideally use full-text search or ILIKE on first_name/last_name
      query = query.or(
        `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,username.ilike.%${params.search}%`,
      );
    }

    if (params.role) {
      query = query.eq("role", params.role);
    }

    if (params.status) {
      query = query.eq("status", params.status);
    }

    // 3. Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize =
      params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      throw new AppError(AUTH_ERRORS.INTERNAL_ERROR, correlationId, error);
    }

    return createActionSuccess(
      {
        users: data,
        count: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
      correlationId,
    );
  });
}
