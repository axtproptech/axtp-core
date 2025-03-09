import { Ledger } from "@signumjs/core";
import { AccountIdentifier } from "@/types/accountIdentifier";

export interface ServiceContext {
  ledger: Ledger;
  principalAccount: AccountIdentifier;
  signAccount: AccountIdentifier;
}
