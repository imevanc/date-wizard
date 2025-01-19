import { TimeUnit } from "./types";

export const isValidTimeUnit = (unit: any): unit is TimeUnit =>
  unit === TimeUnit.MILLISECONDS ||
  unit === TimeUnit.SECONDS ||
  unit === TimeUnit.MINUTES ||
  unit === TimeUnit.HOURS ||
  unit === TimeUnit.DAYS ||
  unit === TimeUnit.WEEKS ||
  unit === TimeUnit.MONTHS ||
  unit === TimeUnit.YEARS;
