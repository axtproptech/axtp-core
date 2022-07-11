import { Ledger, LedgerClientFactory } from "@signumjs/core";
import { Wallet } from "@signumjs/wallets";
import { ServiceContext } from "./ServiceContext";
import { WalletDecorator } from "./WalletDecorator";

export class LedgerService {
  private readonly ledger: Ledger;

  constructor(
    private nodeHost: string,
    private accountPublicKey: string,
    private wallet: Wallet
  ) {
    this.ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    const context: ServiceContext = {
      ledger: this.ledger,
      accountPublicKey,
      wallet: new WalletDecorator(wallet),
    };
  }

  async doesAccountExist(accountId: string): Promise<boolean> {
    try {
      await this.ledger.account.getAccount({ accountId });
      return true;
    } catch (e: any) {
      return false;
    }
  }
}
