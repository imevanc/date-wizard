import type { CustomFormat, DateComponents, DateInput } from "./types.d.ts";

import { ChronoBoxError } from "./errors";
import { isValidTimeUnit, truncateDate } from "./utils";
import { DateFormat, TimeUnit } from "./enums";

export class ChronoBox<TFormat extends DateFormat | CustomFormat = DateFormat> {
  private readonly date: Date;
  private readonly format: TFormat;

  constructor(date?: DateInput, format: TFormat = DateFormat.ISO as TFormat) {
    this.format = format;

    try {
      this.date = date ? new Date(date) : new Date();
      if (isNaN(this.date.getTime())) {
        throw new ChronoBoxError("Invalid date input");
      }
    } catch (error) {
      throw new ChronoBoxError(
        `Failed to parse date: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Add a specified amount of time units to the date
   * @param amount The number of units to add (can be negative to subtract)
   * @param unit The time unit to add (milliseconds, seconds, minutes, hours, days, weeks, months, years)
   * @returns A new ChronoBox instance with the updated date
   */
  add<T extends TimeUnit>(amount: number, unit: T): ChronoBox<TFormat> {
    const newDate = new Date(this.date);

    switch (unit) {
      case TimeUnit.MILLISECONDS:
        newDate.setMilliseconds(newDate.getMilliseconds() + amount);
        break;
      case TimeUnit.SECONDS:
        newDate.setSeconds(newDate.getSeconds() + amount);
        break;
      case TimeUnit.MINUTES:
        newDate.setMinutes(newDate.getMinutes() + amount);
        break;
      case TimeUnit.HOURS:
        newDate.setHours(newDate.getHours() + amount);
        break;
      case TimeUnit.DAYS:
        newDate.setDate(newDate.getDate() + amount);
        break;
      case TimeUnit.WEEKS:
        newDate.setDate(newDate.getDate() + amount * 7);
        break;
      case TimeUnit.MONTHS: {
        const dayOfMonth = newDate.getDate();
        newDate.setDate(1); // Temporarily set to the first of the month
        newDate.setMonth(newDate.getMonth() + amount);
        const maxDaysInNewMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        newDate.setDate(Math.min(dayOfMonth, maxDaysInNewMonth));
        break;
      }
      case TimeUnit.YEARS: {
        const dayOfMonth = newDate.getDate();
        newDate.setDate(1); // Temporarily set to the first of the month
        newDate.setFullYear(newDate.getFullYear() + amount);
        const maxDaysInNewMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        newDate.setDate(Math.min(dayOfMonth, maxDaysInNewMonth));
        break;
      }
      default:
        const _exhaustiveCheck: never = unit;
        throw new ChronoBoxError(`Unsupported time unit: ${unit}`);
    }

    return new ChronoBox<TFormat>(newDate, this.format);
  }

  /**
   * Subtract a specified amount of time units from the date
   * @param amount The number of units to subtract
   * @param unit The time unit to subtract (milliseconds, seconds, minutes, hours, days, weeks, months, years)
   * @returns A new ChronoBox instance with the updated date
   */
  subtract<T extends TimeUnit>(amount: number, unit: T): ChronoBox<TFormat> {
    return this.add(-amount, unit);
  }

  /**
   * Get the difference between two dates in the specified unit
   * @param other The date to compare with
   * @param unit The time unit to express the difference in (defaults to days)
   * @returns The difference between the dates in the specified unit
   */
  diff(other: DateInput, unit: TimeUnit = TimeUnit.DAYS): number {
    const otherDate = new Date(other);
    const diffMs = this.date.getTime() - otherDate.getTime();

    if (!isValidTimeUnit(unit)) {
      throw new ChronoBoxError(`Unsupported time unit: ${unit}`);
    }

    switch (unit) {
      case TimeUnit.MILLISECONDS:
        return diffMs;
      case TimeUnit.SECONDS:
        return diffMs / 1000;
      case TimeUnit.MINUTES:
        return diffMs / (1000 * 60);
      case TimeUnit.HOURS:
        return diffMs / (1000 * 60 * 60);
      case TimeUnit.DAYS:
        return diffMs / (1000 * 60 * 60 * 24);
      case TimeUnit.WEEKS:
        return diffMs / (1000 * 60 * 60 * 24 * 7);
      case TimeUnit.MONTHS:
        return (
          (this.date.getFullYear() - otherDate.getFullYear()) * 12 +
          (this.date.getMonth() - otherDate.getMonth())
        );
      case TimeUnit.YEARS:
        return this.date.getFullYear() - otherDate.getFullYear();
      default:
        const _exhaustiveCheck: never = unit;
        throw new ChronoBoxError(`Unsupported time unit: ${unit}`);
    }
  }

  /**
   * Get individual components of the date
   * @returns An object containing the year, month, day, hours, minutes, seconds, and milliseconds
   */
  getComponents(): DateComponents {
    return {
      year: this.date.getFullYear(),
      month: this.date.getMonth() + 1,
      day: this.date.getDate(),
      hours: this.date.getHours(),
      minutes: this.date.getMinutes(),
      seconds: this.date.getSeconds(),
      milliseconds: this.date.getMilliseconds(),
    };
  }

  /**
   * Format the date according to the format string
   * @returns A string representation of the date formatted according to the current format
   */
  formatDate(): string {
    const components = this.getComponents();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let result = this.format;

    return result
      .replace("YYYY", components.year.toString())
      .replace("MMMM", monthNames[components.month - 1])
      .replace("MM", components.month.toString().padStart(2, "0"))
      .replace("DD", components.day.toString().padStart(2, "0"));
  }

  /**
   * Check if the date is valid
   * @returns True if the date is valid, false otherwise
   */
  isValid(): boolean {
    return !isNaN(this.date.getTime());
  }

  /**
   * Get the underlying Date object
   * @returns A new Date object representing the current date
   */
  toDate(): Date {
    return new Date(this.date);
  }

  /**
   * Create a new ChronoBox with a different format
   * @param newFormat The new format to use for date formatting
   * @returns A new ChronoBox instance with the same date but different format
   */
  withFormat<NewFormat extends DateFormat | CustomFormat>(
    newFormat: NewFormat
  ): ChronoBox<NewFormat> {
    return new ChronoBox<NewFormat>(this.date, newFormat);
  }

  /**
   * Check if this date is after the specified date
   * @param other The date to compare against
   * @param granularity The time unit granularity for comparison (defaults to milliseconds for exact comparison)
   * @returns True if this date is after the specified date
   */
  isAfter(
    other: DateInput,
    granularity: TimeUnit = TimeUnit.MILLISECONDS
  ): boolean {
    const otherDate = new Date(other);

    if (granularity === TimeUnit.MILLISECONDS) {
      return this.date.getTime() > otherDate.getTime();
    }

    // For other granularities, we need to truncate both dates to the specified unit
    const thisDateTruncated = truncateDate(this.date, granularity).getTime();
    const otherDateTruncated = truncateDate(otherDate, granularity).getTime();
    console.log("thisDateTruncated:", thisDateTruncated);
    console.log("otherDateTruncated:", otherDateTruncated);

    return thisDateTruncated > otherDateTruncated;
  }
}
