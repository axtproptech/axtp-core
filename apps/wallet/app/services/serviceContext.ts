import { Ledger } from "@signumjs/core";

export interface ServiceContext {
  ledger: Ledger;
  accountPublicKey: string;
}
