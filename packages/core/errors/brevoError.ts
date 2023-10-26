export class BrevoError extends Error {
  private code = "";
  private status = -1;

  constructor(brevoError: any) {
    super(brevoError.message);
    if (brevoError.response?.text) {
      try {
        const parsed = JSON.parse(brevoError.response.text);
        this.code = parsed.code;
        this.message = parsed.message;
      } catch (e) {
        // ignore
      }
    }
    this.status = brevoError.status;
  }

  get errorCode() {
    return this.code;
  }

  get errorStatus() {
    return this.status;
  }
}
