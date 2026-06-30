import { describe, it, expect } from "vitest";
import { dashboardFilterSchema } from "../dashboard.schemas";
import { format, addDays, subDays } from "date-fns";

describe("dashboardFilterSchema", () => {
  it("validates correctly when no dates are provided", () => {
    const result = dashboardFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("validates correctly with valid past date strings", () => {
    const start = format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const end = format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'");

    const result = dashboardFilterSchema.safeParse({
      startDate: start,
      endDate: end,
    });
    expect(result.success).toBe(true);
  });

  it("fails validation if start date is after end date", () => {
    const start = format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const end = format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss'Z'");

    const result = dashboardFilterSchema.safeParse({
      startDate: start,
      endDate: end,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Start Date cannot be after End Date.",
      );
    }
  });

  it("fails validation if end date is in the future", () => {
    const start = format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const end = format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'");

    const result = dashboardFilterSchema.safeParse({
      startDate: start,
      endDate: end,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Future dates are not permitted.",
      );
    }
  });
});
