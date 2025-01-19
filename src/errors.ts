export class ChronoBoxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChronoBoxError";
  }
}
