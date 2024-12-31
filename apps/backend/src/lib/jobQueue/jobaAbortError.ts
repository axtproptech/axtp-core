export class JobAbortError extends Error {
  constructor(reason: string) {
    super(`[Job Aborted] - ${reason}`);
  }
}
