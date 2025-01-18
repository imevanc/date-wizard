export enum DateFormat {
    ISO = 'YYYY-MM-DD',
    US = 'MM/DD/YYYY',
    EU = 'DD.MM.YYYY',
    VERBOSE = 'MMMM DD, YYYY'
}

export enum TimeUnit {
    MILLISECONDS = 'milliseconds',
    SECONDS = 'seconds',
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
    WEEKS = 'weeks',
    MONTHS = 'months',
    YEARS = 'years'
}

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