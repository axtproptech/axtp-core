import { ConfirmedTransaction } from "@signumjs/wallets";
import { HttpError } from "@signumjs/http";

export class LedgerError extends Error {}

type LedgerCallFunction = (
  ...args: any[]
) => Promise<string | ConfirmedTransaction>;

export async function withError(fn: LedgerCallFunction) {
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
