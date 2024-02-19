export class KeyError extends Error {
  constructor(msg: string) {
    super(`Key Error: ${msg}`);
  }
}
