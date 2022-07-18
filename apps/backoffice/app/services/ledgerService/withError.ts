import { ConfirmedTransaction } from "@signumjs/wallets";
import { HttpError } from "@signumjs/http";

export class LedgerError extends Error {}

type LedgerCallFunction<T> = (...args: any[]) => Promise<T>;

export async function withError<T>(fn: LedgerCallFunction<T>) {
  try {
    return await fn();
  } catch (e) {
    console.error(e);
    let message = "😭 That did not work!";
    if (e instanceof HttpError) {
      message += ` - Signum Ledger returned: ${e.message}`;
    }
    throw new LedgerError(message);
  }
}
