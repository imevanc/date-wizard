export type DateInput = Date | string | number;

export interface DateComponents {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export type FormatTemplate<T extends string> = T;
export type CustomFormat = FormatTemplate<string>;
