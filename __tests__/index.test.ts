import { DateFormat, TimeUnit } from "../src/enums";
import { ChronoBoxError } from "../src/errors";
import { truncateDate } from "../src/utils";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ChronoBox } from "../src";

describe("diff", () => {
  const baseDate = new ChronoBox("2024-01-15");

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
    const wizard = new ChronoBox(input, format);
    expect(wizard.formatDate()).toBe(expected);
  });

  test("handles custom format", () => {
    const wizard = new ChronoBox<"DD-MM-YYYY">("2024-01-01", "DD-MM-YYYY");
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
      const wizard = new ChronoBox(baseDate);
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
      const wizard = new ChronoBox(baseDate);
      expect(wizard.add(amount, unit).formatDate()).toBe(expected);
    });

    test.each([
      ["negative days", TimeUnit.DAYS, -5, "2023-12-27"],
      ["negative months", TimeUnit.MONTHS, -1, "2023-12-01"],
      ["negative years", TimeUnit.YEARS, -1, "2023-01-01"],
    ])("handles %s correctly", (_, unit, amount, expected) => {
      const wizard = new ChronoBox("2024-01-01");
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
        const wizard = new ChronoBox(startDate);
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
      const wizard = new ChronoBox(baseDate);
      expect(wizard.subtract(amount, unit).formatDate()).toBe(expected);
    });
  });
});

describe("diff", () => {
  const baseDate = new ChronoBox("2024-01-15");

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
        new ChronoBoxError(`Unsupported time unit: ${unsupportedUnit}`)
      );
    }
  );
});

test("returns correct date components", () => {
  const date = new ChronoBox("2024-01-15T12:30:45.123");
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
  const date = new ChronoBox("2024-01-15", DateFormat.ISO);

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

describe("isAfter", () => {
  const mockCurrentDate = new Date("2024-02-25T15:45:30.123Z");
  const base = new ChronoBox(mockCurrentDate);

  const earlier = new ChronoBox(
    new Date(mockCurrentDate.getTime() - 60 * 60 * 1000)
  );
  const same = new ChronoBox(mockCurrentDate); // Same date
  const later = new ChronoBox(
    new Date(mockCurrentDate.getTime() + 60 * 60 * 1000)
  );
  const nextMonth = new ChronoBox(
    new Date(mockCurrentDate.getFullYear(), mockCurrentDate.getMonth() + 1, 1)
  );
  const lastMonth = new ChronoBox(
    new Date(mockCurrentDate.getFullYear(), mockCurrentDate.getMonth() - 1, 1)
  );
  const nextYear = new ChronoBox(
    new Date(
      mockCurrentDate.getFullYear() + 1,
      mockCurrentDate.getMonth(),
      mockCurrentDate.getDate()
    )
  );

  const leapYear = new ChronoBox(new Date("2024-02-29T12:00:00.000Z"));
  const nonLeapYear = new ChronoBox(new Date("2023-02-28T12:00:00.000Z"));
  const utcMidnight = new ChronoBox(
    new Date(mockCurrentDate.setHours(0, 0, 0, 0))
  );

  test.each([
    [same, TimeUnit.MILLISECONDS, false],
    [earlier, TimeUnit.MILLISECONDS, true],
    [earlier, TimeUnit.HOURS, true],
    [same, TimeUnit.HOURS, false],
    [later, TimeUnit.HOURS, false],
    [earlier, TimeUnit.DAYS, false],
    [later, TimeUnit.DAYS, false],
    [nextMonth, TimeUnit.MONTHS, false],
    [lastMonth, TimeUnit.MONTHS, true],
    [nextYear, TimeUnit.YEARS, false],
    [leapYear, TimeUnit.DAYS, false],
    [nonLeapYear, TimeUnit.DAYS, true],
    [utcMidnight, TimeUnit.DAYS, false],
  ])(
    "returns %s when comparing with %s granularity",
    (other, granularity, expected) => {
      const baseTruncated = truncateDate(base.toDate(), granularity);
      const otherTruncated = truncateDate(other.toDate(), granularity);

      console.log(
        `Comparing: base(${baseTruncated}) with other(${otherTruncated}) at granularity ${granularity}`
      );

      expect(base.isAfter(other.toDate(), granularity)).toBe(expected);
    }
  );

  test("throws error for unsupported time unit", () => {
    expect(() =>
      base.isAfter(later.toDate(), "INVALID_UNIT" as TimeUnit)
    ).toThrow();
  });
});

describe("isBefore", () => {
  const mockCurrentDate = new Date("2024-02-25T15:45:30.123Z");
  const base = new ChronoBox(mockCurrentDate);

  const earlier = new ChronoBox(
    new Date(mockCurrentDate.getTime() - 60 * 60 * 1000)
  );
  const same = new ChronoBox(mockCurrentDate); // Same date
  const later = new ChronoBox(
    new Date(mockCurrentDate.getTime() + 60 * 60 * 1000)
  );
  const nextMonth = new ChronoBox(
    new Date(mockCurrentDate.getFullYear(), mockCurrentDate.getMonth() + 1, 1)
  );
  const lastMonth = new ChronoBox(
    new Date(mockCurrentDate.getFullYear(), mockCurrentDate.getMonth() - 1, 1)
  );
  const nextYear = new ChronoBox(
    new Date(
      mockCurrentDate.getFullYear() + 1,
      mockCurrentDate.getMonth(),
      mockCurrentDate.getDate()
    )
  );

  const leapYear = new ChronoBox(new Date("2024-02-29T12:00:00.000Z"));
  const nonLeapYear = new ChronoBox(new Date("2023-02-28T12:00:00.000Z"));
  const utcMidnight = new ChronoBox(
    new Date(mockCurrentDate.setHours(0, 0, 0, 0))
  );

  test.each([
    [same, TimeUnit.MILLISECONDS, false],
    [earlier, TimeUnit.MILLISECONDS, false],
    [earlier, TimeUnit.HOURS, false],
    [same, TimeUnit.HOURS, false],
    [later, TimeUnit.HOURS, true],
    [earlier, TimeUnit.DAYS, false],
    [later, TimeUnit.DAYS, false],
    [nextMonth, TimeUnit.MONTHS, true],
    [lastMonth, TimeUnit.MONTHS, false],
    [nextYear, TimeUnit.YEARS, true],
    [leapYear, TimeUnit.DAYS, true],
    [nonLeapYear, TimeUnit.DAYS, false],
    [utcMidnight, TimeUnit.DAYS, false],
  ])(
    "returns %s when comparing with %s granularity",
    (other, granularity, expected) => {
      const baseTruncated = truncateDate(base.toDate(), granularity);
      const otherTruncated = truncateDate(other.toDate(), granularity);

      console.log(
        `Comparing: base(${baseTruncated}) with other(${otherTruncated}) at granularity ${granularity}`
      );

      expect(base.isBefore(other.toDate(), granularity)).toBe(expected);
    }
  );

  test("throws error for unsupported time unit", () => {
    expect(() =>
      base.isBefore(later.toDate(), "INVALID_UNIT" as TimeUnit)
    ).toThrow();
  });
});

describe("ChronoBox Timezone Functions", () => {
  let chronoBox: ChronoBox;

  beforeEach(() => {
    // Mock the Intl.DateTimeFormat implementation for testing
    const mockDateTimeFormat = jest
      .spyOn(Intl, "DateTimeFormat")
      .mockImplementation((locale, options) => {
        return {
          format: (date: Date) => {
            // This is a simplified mock - in real tests you might need more complex logic
            if (options?.timeZone === "America/New_York") {
              return "1/1/2023 10:00:00"; // -5 hours from UTC
            } else if (options?.timeZone === "Europe/London") {
              return "1/1/2023 15:00:00"; // +0 hours from UTC
            } else if (options?.timeZone === "Asia/Tokyo") {
              return "1/2/2023 0:00:00"; // +9 hours from UTC
            } else if (options?.timeZone === "UTC") {
              return "1/1/2023 15:00:00"; // UTC time
            }
            return date.toLocaleString();
          },
          resolvedOptions: () => ({
            ...options,
            locale: locale || "en-US",
          }),
        } as Intl.DateTimeFormat;
      });

    chronoBox = new ChronoBox(new Date("2023-01-01T15:00:00Z"));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("convertTimezone", () => {
    it("should convert a date from one timezone to another", () => {
      const result = chronoBox.convertTimezone(
        new Date("2023-01-01T15:00:00Z"),
        "UTC",
        "America/New_York"
      );

      // With our mock, we expect the result to be a date representing 10:00 AM
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(0);
    });

    it("should work with ChronoBox instances", () => {
      const anotherChronoBox = new ChronoBox(new Date("2023-01-01T20:00:00Z"));
      const result = chronoBox.convertTimezone(
        anotherChronoBox,
        "UTC",
        "Europe/London"
      );

      // Verify the result is a Date object
      expect(result instanceof Date).toBe(true);
    });

    it("should handle crossing date boundaries", () => {
      // Test converting from UTC to Tokyo (crosses day boundary)
      const result = chronoBox.convertTimezone(
        new Date("2023-01-01T15:00:00Z"),
        "UTC",
        "Asia/Tokyo"
      );

      // With our mock, expect the result to be January 2nd
      expect(result.getDate()).toBe(2);
    });
  });

  describe("isInDST", () => {
    it("should return false for timezones without DST", () => {
      // Mock implementation for this test
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "Asia/Tokyo") return -540; // No DST - constant offset
          return 0;
        });

      const result = chronoBox.isInDST(new Date(), "Asia/Tokyo");
      expect(result).toBe(false);
    });

    it("should return true for dates during DST", () => {
      // Mock to simulate a date in summer for US Eastern Time
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "America/New_York") {
            // For the test date, return DST offset
            const dateObj = date instanceof ChronoBox ? date.toDate() : date;
            if (dateObj.getMonth() === 6) return -240; // July (DST active, -4 hours)
            if (dateObj.getMonth() === 0) return -300; // January (no DST, -5 hours)
            return -240; // For the actual date being tested (DST active)
          }
          return 0;
        });

      const summerDate = new Date("2023-07-15T12:00:00Z");
      const result = chronoBox.isInDST(summerDate, "America/New_York");
      expect(result).toBe(true);
    });

    it("should return false for dates outside DST", () => {
      // Mock to simulate a date in winter for US Eastern Time
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "America/New_York") {
            // For the test date, return standard time offset
            const dateObj = date instanceof ChronoBox ? date.toDate() : date;
            if (dateObj.getMonth() === 6) return -240; // July (DST active, -4 hours)
            if (dateObj.getMonth() === 0) return -300; // January (no DST, -5 hours)
            return -300; // For the actual date being tested (standard time)
          }
          return 0;
        });

      const winterDate = new Date("2023-01-15T12:00:00Z");
      const result = chronoBox.isInDST(winterDate, "America/New_York");
      expect(result).toBe(false);
    });

    it("should work with ChronoBox instances", () => {
      // Setup the mock
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "America/New_York") {
            const dateObj = date instanceof ChronoBox ? date.toDate() : date;
            if (dateObj.getMonth() === 6) return -240;
            if (dateObj.getMonth() === 0) return -300;
            // This date should be in summer (DST)
            return -240;
          }
          return 0;
        });

      const summerBox = new ChronoBox(new Date("2023-07-15T12:00:00Z"));
      const result = chronoBox.isInDST(summerBox, "America/New_York");
      expect(result).toBe(true);
    });
  });

  describe("getTimezoneOffsetMinutes", () => {
    it("should return positive offset for timezones behind UTC", () => {
      // Mock implementation
      jest
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation((locale, options) => {
          return {
            format: (date: Date) => {
              if (options?.timeZone === "America/New_York") {
                // Simulate NY being 5 hours behind UTC
                const nyDate = new Date(date);
                nyDate.setHours(date.getHours() - 5);
                return nyDate.toLocaleString();
              } else if (options?.timeZone === "UTC") {
                return date.toLocaleString();
              }
              return date.toLocaleString();
            },
            resolvedOptions: () => ({ ...options, locale: locale || "en-US" }),
          } as Intl.DateTimeFormat;
        });

      // In real implementation, this would return 300 (5 hours = 300 minutes) for NY
      const result = chronoBox.getTimezoneOffsetMinutes(
        new Date(),
        "America/New_York"
      );
      expect(result).toBeGreaterThan(0);
    });

    it("should return negative offset for timezones ahead of UTC", () => {
      // Mock implementation
      jest
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation((locale, options) => {
          return {
            format: (date: Date) => {
              if (options?.timeZone === "Asia/Tokyo") {
                // Simulate Tokyo being 9 hours ahead of UTC
                const tokyoDate = new Date(date);
                tokyoDate.setHours(date.getHours() + 9);
                return tokyoDate.toLocaleString();
              } else if (options?.timeZone === "UTC") {
                return date.toLocaleString();
              }
              return date.toLocaleString();
            },
            resolvedOptions: () => ({ ...options, locale: locale || "en-US" }),
          } as Intl.DateTimeFormat;
        });

      // In real implementation, this would return -540 (9 hours = 540 minutes) for Tokyo
      const result = chronoBox.getTimezoneOffsetMinutes(
        new Date(),
        "Asia/Tokyo"
      );
      expect(result).toBeLessThan(0);
    });

    it("should work with ChronoBox instances", () => {
      const testBox = new ChronoBox(new Date());
      const result = chronoBox.getTimezoneOffsetMinutes(
        testBox,
        "Europe/London"
      );

      // Just verify it runs without error when given a ChronoBox
      expect(typeof result).toBe("number");
    });
  });

  describe("findDSTTransitions", () => {
    it("should return null values for timezones without DST", () => {
      // Mock implementation
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "Asia/Tokyo") return -540; // No DST
          return 0;
        });

      const result = chronoBox.findDSTTransitions(2023, "Asia/Tokyo");
      expect(result.start).toBeNull();
      expect(result.end).toBeNull();
    });

    it("should find DST transitions for timezones with DST", () => {
      // Mock implementation to simulate DST transitions
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "America/New_York") {
            // Simplified DST logic for testing
            const dateObj = date instanceof ChronoBox ? date.toDate() : date;
            const month = dateObj.getMonth();
            // March-November is DST period in this simplified test
            return month >= 2 && month <= 10 ? -240 : -300;
          }
          return 0;
        });

      // Mock the helper function
      jest
        .spyOn(chronoBox, "findExactTransitionHour")
        .mockImplementation((start, end, timezone) => {
          if (end.getMonth() === 2) {
            // March
            return new Date("2023-03-12T07:00:00Z"); // Spring forward
          } else {
            return new Date("2023-11-05T06:00:00Z"); // Fall back
          }
        });

      const result = chronoBox.findDSTTransitions(2023, "America/New_York");

      // Should find both transitions
      expect(result.start).not.toBeNull();
      expect(result.end).not.toBeNull();

      // Check transition dates (based on our mock implementation)
      if (result.start && result.end) {
        expect(result.start.getMonth()).toBe(2); // March
        expect(result.end.getMonth()).toBe(10); // November
      }
    });

    it("should handle southern hemisphere DST", () => {
      // Mock for southern hemisphere where DST is opposite
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          if (timezone === "Australia/Sydney") {
            const dateObj = date instanceof ChronoBox ? date.toDate() : date;
            const month = dateObj.getMonth();
            // April-September is standard time, October-March is DST
            return month >= 3 && month <= 8 ? -600 : -660;
          }
          return 0;
        });

      // Mock the helper function
      jest
        .spyOn(chronoBox, "findExactTransitionHour")
        .mockImplementation((start, end, timezone) => {
          if (end.getMonth() === 9) {
            // October
            return new Date("2023-10-01T16:00:00Z"); // Spring forward
          } else {
            return new Date("2023-04-02T16:00:00Z"); // Fall back
          }
        });

      const result = chronoBox.findDSTTransitions(2023, "Australia/Sydney");

      // Should find both transitions
      expect(result.start).not.toBeNull();
      expect(result.end).not.toBeNull();

      // Check transitions match southern hemisphere pattern
      if (result.start && result.end) {
        expect([3, 9]).toContain(result.start.getMonth()); // April or October
        expect([3, 9]).toContain(result.end.getMonth()); // April or October
      }
    });
  });

  describe("findExactTransitionHour", () => {
    it("should find the exact transition hour using binary search", () => {
      // Mock implementation
      let callCount = 0;
      jest
        .spyOn(chronoBox, "getTimezoneOffsetMinutes")
        .mockImplementation((date, timezone) => {
          callCount++;
          // Simulate a transition at exactly 2:00 AM on March 12, 2023
          const testDate = date instanceof ChronoBox ? date.toDate() : date;
          const transitionTime = new Date("2023-03-12T07:00:00Z").getTime(); // 2 AM EST / 7 AM UTC

          return testDate.getTime() < transitionTime ? -300 : -240;
        });

      const beforeTransition = new Date("2023-03-12T06:00:00Z"); // 1 AM EST
      const afterTransition = new Date("2023-03-12T08:00:00Z"); // 3 AM EDT

      const result = chronoBox.findExactTransitionHour(
        beforeTransition,
        afterTransition,
        "America/New_York"
      );

      // Check that binary search was actually used (multiple calls to getTimezoneOffsetMinutes)
      expect(callCount).toBeGreaterThan(3);

      // The result should be very close to the actual transition time
      const transitionTime = new Date("2023-03-12T07:00:00Z").getTime();
      expect(Math.abs(result.getTime() - transitionTime)).toBeLessThanOrEqual(
        60000
      ); // Within 1 minute
    });
  });
});
