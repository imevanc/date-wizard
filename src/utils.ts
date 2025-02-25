import { TimeUnit } from "./enums";
import { ChronoBoxError } from "./errors";

export const isValidTimeUnit = (unit: any): unit is TimeUnit =>
  unit === TimeUnit.MILLISECONDS ||
  unit === TimeUnit.SECONDS ||
  unit === TimeUnit.MINUTES ||
  unit === TimeUnit.HOURS ||
  unit === TimeUnit.DAYS ||
  unit === TimeUnit.WEEKS ||
  unit === TimeUnit.MONTHS ||
  unit === TimeUnit.YEARS;

/**
 * Truncate a date to a specific granularity
 * @param date The date to truncate
 * @param granularity The time unit to truncate to
 * @returns A new Date object truncated to the specified granularity
 */
export const truncateDate = (date: Date, granularity: TimeUnit): Date => {
  const newDate = new Date(date);

  switch (granularity) {
    case TimeUnit.SECONDS:
      newDate.setMilliseconds(0);
      break;
    case TimeUnit.MINUTES:
      newDate.setSeconds(0, 0);
      break;
    case TimeUnit.HOURS:
      newDate.setMinutes(0, 0, 0);
      break;
    case TimeUnit.DAYS:
      newDate.setHours(0, 0, 0, 0);
      break;
    case TimeUnit.WEEKS: {
      const dayOfWeek = newDate.getDay();
      const diff = newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday as first day
      newDate.setDate(diff);
      newDate.setHours(0, 0, 0, 0);
      break;
    }
    case TimeUnit.MONTHS:
      newDate.setDate(1);
      newDate.setHours(0, 0, 0, 0);
      break;
    case TimeUnit.YEARS:
      newDate.setUTCFullYear(newDate.getUTCFullYear(), 0, 1);
      newDate.setUTCHours(0, 0, 0, 0);
      break;
    case TimeUnit.MILLISECONDS:
      // No truncation needed
      break;
    default:
      const _exhaustiveCheck: never = granularity;
      throw new ChronoBoxError(
        `Unsupported time unit for truncation: ${granularity}`
      );
  }

  return newDate;
};
