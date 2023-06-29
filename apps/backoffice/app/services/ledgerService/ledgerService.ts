import { Ledger, LedgerClientFactory } from "@signumjs/core";
import { Wallet } from "@signumjs/wallets";
import { MasterContractService } from "./masterContractService";
import { ServiceContext } from "./serviceContext";
import { WalletDecorator } from "./walletDecorator";
import { PoolContractService } from "./poolContractService";
import { AccountService } from "./accountService";
import { AssetAliasService } from "@axtp/core";

export class LedgerService {
  private readonly ledger: Ledger;
  private readonly masterContractService: MasterContractService;
  private readonly poolContractService: PoolContractService;
  private readonly accountService: AccountService;

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

    this.accountService = new AccountService(context);
    this.masterContractService = new MasterContractService(context);
    this.poolContractService = new PoolContractService(
      context,
      this.masterContractService
    );
  }

  get masterContract(): MasterContractService {
    return this.masterContractService;
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }

  get account() {
    return this.accountService;
  }
}
