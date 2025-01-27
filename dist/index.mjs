// src/errors.ts
var ChronoBoxError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ChronoBoxError";
  }
};

// src/utils.ts
var isValidTimeUnit = (unit) => unit === "milliseconds" /* MILLISECONDS */ || unit === "seconds" /* SECONDS */ || unit === "minutes" /* MINUTES */ || unit === "hours" /* HOURS */ || unit === "days" /* DAYS */ || unit === "weeks" /* WEEKS */ || unit === "months" /* MONTHS */ || unit === "years" /* YEARS */;

// src/index.ts
var ChronoBox = class _ChronoBox {
  constructor(date, format = "YYYY-MM-DD" /* ISO */) {
    this.format = format;
    try {
      this.date = date ? new Date(date) : /* @__PURE__ */ new Date();
      if (isNaN(this.date.getTime())) {
        throw new ChronoBoxError("Invalid date input");
      }
    } catch (error) {
      throw new ChronoBoxError(
        `Failed to parse date: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  /**
   * Add a specified amount of time units to the date
   */
  add(amount, unit) {
    const newDate = new Date(this.date);
    switch (unit) {
      case "milliseconds" /* MILLISECONDS */:
        newDate.setMilliseconds(newDate.getMilliseconds() + amount);
        break;
      case "seconds" /* SECONDS */:
        newDate.setSeconds(newDate.getSeconds() + amount);
        break;
      case "minutes" /* MINUTES */:
        newDate.setMinutes(newDate.getMinutes() + amount);
        break;
      case "hours" /* HOURS */:
        newDate.setHours(newDate.getHours() + amount);
        break;
      case "days" /* DAYS */:
        newDate.setDate(newDate.getDate() + amount);
        break;
      case "weeks" /* WEEKS */:
        newDate.setDate(newDate.getDate() + amount * 7);
        break;
      case "months" /* MONTHS */: {
        const dayOfMonth = newDate.getDate();
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + amount);
        const maxDaysInNewMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        newDate.setDate(Math.min(dayOfMonth, maxDaysInNewMonth));
        break;
      }
      case "years" /* YEARS */: {
        const dayOfMonth = newDate.getDate();
        newDate.setDate(1);
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
        const _exhaustiveCheck = unit;
        throw new ChronoBoxError(`Unsupported time unit: ${unit}`);
    }
    return new _ChronoBox(newDate, this.format);
  }
  /**
   * Subtract a specified amount of time units from the date
   */
  subtract(amount, unit) {
    return this.add(-amount, unit);
  }
  /**
   * Get the difference between two dates in the specified unit
   */
  diff(other, unit = "days" /* DAYS */) {
    const otherDate = new Date(other);
    const diffMs = this.date.getTime() - otherDate.getTime();
    if (!isValidTimeUnit(unit)) {
      throw new ChronoBoxError(`Unsupported time unit: ${unit}`);
    }
    switch (unit) {
      case "milliseconds" /* MILLISECONDS */:
        return diffMs;
      case "seconds" /* SECONDS */:
        return diffMs / 1e3;
      case "minutes" /* MINUTES */:
        return diffMs / (1e3 * 60);
      case "hours" /* HOURS */:
        return diffMs / (1e3 * 60 * 60);
      case "days" /* DAYS */:
        return diffMs / (1e3 * 60 * 60 * 24);
      case "weeks" /* WEEKS */:
        return diffMs / (1e3 * 60 * 60 * 24 * 7);
      case "months" /* MONTHS */:
        return (this.date.getFullYear() - otherDate.getFullYear()) * 12 + (this.date.getMonth() - otherDate.getMonth());
      case "years" /* YEARS */:
        return this.date.getFullYear() - otherDate.getFullYear();
      default:
        const _exhaustiveCheck = unit;
        throw new ChronoBoxError(`Unsupported time unit: ${unit}`);
    }
  }
  /**
   * Get individual components of the date
   */
  getComponents() {
    return {
      year: this.date.getFullYear(),
      month: this.date.getMonth() + 1,
      day: this.date.getDate(),
      hours: this.date.getHours(),
      minutes: this.date.getMinutes(),
      seconds: this.date.getSeconds(),
      milliseconds: this.date.getMilliseconds()
    };
  }
  /**
   * Format the date according to the format string
   */
  formatDate() {
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
      "December"
    ];
    let result = this.format;
    return result.replace("YYYY", components.year.toString()).replace("MMMM", monthNames[components.month - 1]).replace("MM", components.month.toString().padStart(2, "0")).replace("DD", components.day.toString().padStart(2, "0"));
  }
  /**
   * Check if the date is valid
   */
  isValid() {
    return !isNaN(this.date.getTime());
  }
  /**
   * Get the underlying Date object
   */
  toDate() {
    return new Date(this.date);
  }
  /**
   * Create a new ChronoBox with a different format
   */
  withFormat(newFormat) {
    return new _ChronoBox(this.date, newFormat);
  }
};
export {
  ChronoBox
};
//# sourceMappingURL=index.mjs.map