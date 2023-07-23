import { Ledger } from "@signumjs/core";
import { WalletDecorator } from "./walletDecorator";

export interface ServiceContext {
  ledger: Ledger;
  wallet: WalletDecorator;
  accountPublicKey: string;
  principalAccountId: string;
}
