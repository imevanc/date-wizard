import { DateWizard } from "../src";
import { DateFormat, TimeUnit } from "../src/types";
import { DateWizardError } from "../src/errors";

describe("diff", () => {
  const baseDate = new DateWizard("2024-01-15");

  test.each([
    ["days", "2024-01-10", TimeUnit.DAYS, 5],
    ["months", "2023-11-15", TimeUnit.MONTHS, 2],
    ["years", "2022-01-15", TimeUnit.YEARS, 2],
    ["negative days", "2024-01-20", TimeUnit.DAYS, -5],
    [
      "milliseconds",
      "2024-01-14T00:00:00.000Z",
      TimeUnit.MILLISECONDS,
      86400000,
    ],
    ["seconds", "2024-01-14T00:00:00.000Z", TimeUnit.SECONDS, 86400],
    ["minutes", "2024-01-14T00:00:00.000Z", TimeUnit.MINUTES, 1440],
    ["hours", "2024-01-14T00:00:00.000Z", TimeUnit.HOURS, 24],
    ["weeks", "2024-01-07", TimeUnit.WEEKS, 1.142857], // Example with weeks
  ])("calculates %s difference correctly", (_, compareDate, unit, expected) => {
    const result = baseDate.diff(compareDate, unit);
    if (unit === TimeUnit.WEEKS) {
      expect(result).toBeCloseTo(expected, 5); // Precision for weeks
    } else {
      expect(result).toBe(expected);
    }
  });
});

describe("Format handling", () => {
  test.each([
    [DateFormat.ISO, "2024-01-01", "2024-01-01"],
    [DateFormat.US, "2024-01-01", "01/01/2024"],
    [DateFormat.EU, "2024-01-01", "01.01.2024"],
    [DateFormat.VERBOSE, "2024-01-01", "January 01, 2024"],
  ])("handles %s format correctly", (format, input, expected) => {
    const wizard = new DateWizard(input, format);
    expect(wizard.formatDate()).toBe(expected);
  });

  test("handles custom format", () => {
    const wizard = new DateWizard<"DD-MM-YYYY">("2024-01-01", "DD-MM-YYYY");
    expect(wizard.formatDate()).toBe("01-01-2024");
  });
});

describe("Time unit operations", () => {
  describe("add", () => {
    const baseDate = "2024-01-01";

    test.each([
      [TimeUnit.MILLISECONDS, 1000, 1000], // delta in ms
      [TimeUnit.SECONDS, 60, 60 * 1000],
      [TimeUnit.MINUTES, 60, 60 * 60 * 1000],
      [TimeUnit.HOURS, 24, 24 * 60 * 60 * 1000],
    ])("adds %s correctly", (unit, amount, expectedDeltaMs) => {
      const wizard = new DateWizard(baseDate);
      const result = wizard.add(amount, unit).toDate();
      expect(result.getTime() - wizard.toDate().getTime()).toBe(
        expectedDeltaMs
      );
    });

    test.each([
      [TimeUnit.DAYS, 5, "2024-01-06"],
      [TimeUnit.WEEKS, 1, "2024-01-08"],
      [TimeUnit.MONTHS, 1, "2024-02-01"],
      [TimeUnit.YEARS, 1, "2025-01-01"],
    ])("adds %s correctly", (unit, amount, expected) => {
      const wizard = new DateWizard(baseDate);
      expect(wizard.add(amount, unit).formatDate()).toBe(expected);
    });

    test.each([
      ["negative days", TimeUnit.DAYS, -5, "2023-12-27"],
      ["negative months", TimeUnit.MONTHS, -1, "2023-12-01"],
      ["negative years", TimeUnit.YEARS, -1, "2023-01-01"],
    ])("handles %s correctly", (_, unit, amount, expected) => {
      const wizard = new DateWizard("2024-01-01");
      expect(wizard.add(amount, unit).formatDate()).toBe(expected);
    });

    test.each([
      ["31 Jan to Feb", "2024-01-31", 1, "2024-02-29"], // leap year
      ["31 Jan to Mar", "2024-01-31", 2, "2024-03-31"],
      ["30 Apr to May", "2024-04-30", 1, "2024-05-30"],
      ["31 Jul to Jun", "2024-07-31", -1, "2024-06-30"], // backward month overflow
      ["31 Mar to Feb", "2024-03-31", -1, "2024-02-29"], // backward leap year
    ])(
      "handles month overflow from %s",
      (_, startDate, monthsToAdd, expected) => {
        const wizard = new DateWizard(startDate);
        expect(wizard.add(monthsToAdd, TimeUnit.MONTHS).formatDate()).toBe(
          expected
        );
      }
    );
  });

  describe("subtract", () => {
    const baseDate = "2024-01-15";

    test.each([
      [TimeUnit.DAYS, 5, "2024-01-10"],
      [TimeUnit.MONTHS, 1, "2023-12-15"],
      [TimeUnit.YEARS, 1, "2023-01-15"],
    ])("subtracts %s correctly", (unit, amount, expected) => {
      const wizard = new DateWizard(baseDate);
      expect(wizard.subtract(amount, unit).formatDate()).toBe(expected);
    });
  });
});

describe("diff", () => {
  const baseDate = new DateWizard("2024-01-15");

  test.each([
    ["days", "2024-01-10", TimeUnit.DAYS, 5],
    ["months", "2023-11-15", TimeUnit.MONTHS, 2],
    ["years", "2022-01-15", TimeUnit.YEARS, 2],
    ["negative days", "2024-01-20", TimeUnit.DAYS, -5],
    [
      "milliseconds",
      "2024-01-14T00:00:00.000Z",
      TimeUnit.MILLISECONDS,
      86400000,
    ],
    ["seconds", "2024-01-14T00:00:00.000Z", TimeUnit.SECONDS, 86400],
    ["minutes", "2024-01-14T00:00:00.000Z", TimeUnit.MINUTES, 1440],
    ["hours", "2024-01-14T00:00:00.000Z", TimeUnit.HOURS, 24],
    ["weeks", "2024-01-07", TimeUnit.WEEKS, 1.142857], // Example with weeks
  ])("calculates %s difference correctly", (_, compareDate, unit, expected) => {
    const result = baseDate.diff(compareDate, unit);
    if (unit === TimeUnit.WEEKS) {
      expect(result).toBeCloseTo(expected, 5); // Precision for weeks
    } else {
      expect(result).toBe(expected);
    }
  });
  test.each([
    [null, "null"],
    ["unsupported", "unsupported"],
  ])(
    "throws an error for unsupported TimeUnit: %s",
    (unsupportedUnit, description) => {
      expect(() => {
        baseDate.diff("2024-01-10", unsupportedUnit as any);
      }).toThrow(
        new DateWizardError(`Unsupported time unit: ${unsupportedUnit}`)
      );
    }
  );
});

test("returns correct date components", () => {
  const date = new DateWizard("2024-01-15T12:30:45.123");
  expect(date.getComponents()).toEqual({
    year: 2024,
    month: 1,
    day: 15,
    hours: 12,
    minutes: 30,
    seconds: 45,
    milliseconds: 123,
  });
});

describe("withFormat", () => {
  const date = new DateWizard("2024-01-15", DateFormat.ISO);

  test.each([
    [DateFormat.US, "01/15/2024"],
    [DateFormat.EU, "15.01.2024"],
  ])("switches to %s format correctly", (format, expected) => {
    expect(date.withFormat(format).formatDate()).toBe(expected);
  });

  test("switches to custom format", () => {
    expect(date.withFormat<"DD-MM-YYYY">("DD-MM-YYYY").formatDate()).toBe(
      "15-01-2024"
    );
  });
});
