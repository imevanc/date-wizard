export class DateWizardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateWizardError";
  }
}
