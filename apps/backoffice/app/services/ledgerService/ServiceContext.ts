import { Ledger } from "@signumjs/core";
import { WalletDecorator } from "./WalletDecorator";

export interface ServiceContext {
  ledger: Ledger;
  wallet: WalletDecorator;
  accountPublicKey: string;
}
