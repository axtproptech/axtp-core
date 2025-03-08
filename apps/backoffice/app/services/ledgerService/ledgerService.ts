import { Ledger, LedgerClientFactory } from "@signumjs/core";
import { Wallet } from "@signumjs/wallets";
import { AxtcContractService } from "./axtcContractService";
import { BurnContractService } from "./burnContractService";
import { ServiceContext } from "./serviceContext";
import { WalletDecorator } from "./walletDecorator";
import { PoolContractService } from "./poolContractService";
import { AccountService } from "./accountService";
import { AssetService } from "./assetService";

/**
 * This is an aggregate service that bundles all ledger/blockchain based operations
 */
export class LedgerService {
  private readonly ledger: Ledger;
  private readonly axtcContractService: AxtcContractService;
  private readonly burnContractService: BurnContractService;
  private readonly poolContractService: PoolContractService;
  private readonly accountService: AccountService;
  private readonly assetService: AssetService;

  constructor(
    private nodeHost: string,
    private accountPublicKey: string,
    private principalAccountId: string,
    private wallet: Wallet
  ) {
    this.ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    const context: ServiceContext = {
      ledger: this.ledger,
      accountPublicKey,
      principalAccountId,
      wallet: new WalletDecorator(wallet),
    };

    this.accountService = new AccountService(context);
    this.axtcContractService = new AxtcContractService(context);
    this.burnContractService = new BurnContractService(context);
    this.poolContractService = new PoolContractService(
      context,
      this.axtcContractService
    );
    this.assetService = new AssetService(context, this.poolContractService);
  }

  get axtcContract(): AxtcContractService {
    return this.axtcContractService;
  }

  get burnContract(): BurnContractService {
    return this.burnContractService;
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }

  get account() {
    return this.accountService;
  }
  get asset() {
    return this.assetService;
  }
}
