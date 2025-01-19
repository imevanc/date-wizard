import { TimeUnit } from "../src/types";
import { isValidTimeUnit } from "../src/utils";

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
