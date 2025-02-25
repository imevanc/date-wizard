import { TimeUnit } from "../src/enums";
import { isValidTimeUnit, truncateDate } from "../src/utils";

describe("isValidTimeUnit", () => {
  test.each([
    [TimeUnit.MILLISECONDS],
    [TimeUnit.SECONDS],
    [TimeUnit.MINUTES],
    [TimeUnit.HOURS],
    [TimeUnit.DAYS],
    [TimeUnit.WEEKS],
    [TimeUnit.MONTHS],
    [TimeUnit.YEARS],
  ])("should return true for valid TimeUnit value: %s", (unit) => {
    expect(isValidTimeUnit(unit)).toBe(true);
  });
});

describe("truncateDate", () => {
  const baseDate = new Date("2024-02-25T15:45:30.123Z");

  test.each([
    [TimeUnit.MILLISECONDS, "2024-02-25T15:45:30.123Z"],
    [TimeUnit.SECONDS, "2024-02-25T15:45:30.000Z"],
    [TimeUnit.MINUTES, "2024-02-25T15:45:00.000Z"],
    [TimeUnit.HOURS, "2024-02-25T15:00:00.000Z"],
    [TimeUnit.DAYS, "2024-02-25T00:00:00.000Z"],
    [TimeUnit.WEEKS, "2024-02-19T00:00:00.000Z"], // Monday of the same week
    [TimeUnit.MONTHS, "2024-02-01T00:00:00.000Z"],
    [TimeUnit.YEARS, "2024-01-01T00:00:00.000Z"],
  ])("truncates to %s", (granularity, expected) => {
    expect(truncateDate(baseDate, granularity)).toEqual(new Date(expected));
  });

  test("throws error for unsupported time unit", () => {
    expect(() => truncateDate(baseDate, "INVALID_UNIT" as TimeUnit)).toThrow();
  });
});
