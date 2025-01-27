type DateInput = Date | string | number;

interface DateComponents {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

type FormatTemplate<T extends string> = T;
type CustomFormat = FormatTemplate<string>;

declare enum DateFormat {
  ISO = "YYYY-MM-DD",
  US = "MM/DD/YYYY",
  EU = "DD.MM.YYYY",
  VERBOSE = "MMMM DD, YYYY",
}
declare enum TimeUnit {
  MILLISECONDS = "milliseconds",
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months",
  YEARS = "years",
}

declare class ChronoBox<
  TFormat extends DateFormat | CustomFormat = DateFormat
> {
  private readonly date;
  private readonly format;
  constructor(date?: DateInput, format?: TFormat);
  /**
   * Add a specified amount of time units to the date
   */
  add<T extends TimeUnit>(amount: number, unit: T): ChronoBox<TFormat>;
  /**
   * Subtract a specified amount of time units from the date
   */
  subtract<T extends TimeUnit>(amount: number, unit: T): ChronoBox<TFormat>;
  /**
   * Get the difference between two dates in the specified unit
   */
  diff(other: DateInput, unit?: TimeUnit): number;
  /**
   * Get individual components of the date
   */
  getComponents(): DateComponents;
  /**
   * Format the date according to the format string
   */
  formatDate(): string;
  /**
   * Check if the date is valid
   */
  isValid(): boolean;
  /**
   * Get the underlying Date object
   */
  toDate(): Date;
  /**
   * Create a new ChronoBox with a different format
   */
  withFormat<NewFormat extends DateFormat | CustomFormat>(
    newFormat: NewFormat
  ): ChronoBox<NewFormat>;
}

export { ChronoBox };
