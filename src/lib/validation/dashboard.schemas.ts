import { z } from "zod";
import { startOfDay, endOfDay, isAfter } from "date-fns";

export const dashboardFilterSchema = z
  .object({
    startDate: z.string().datetime().or(z.date()).optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (isAfter(start, end)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start Date cannot be after End Date.",
          path: ["startDate"],
        });
      }
    }

    // Future dates are not permitted as per functional spec
    if (data.endDate) {
      const end = new Date(data.endDate);
      if (isAfter(end, new Date())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Future dates are not permitted.",
          path: ["endDate"],
        });
      }
    }
  });

export type DashboardFilter = z.infer<typeof dashboardFilterSchema>;
