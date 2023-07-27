import { Ledger } from "@signumjs/core";
import { ServiceContext } from "./serviceContext";
import { PoolContractService } from "./poolContractService";
import { AssetService } from "./assetService";

export class LedgerService {
  private readonly poolContractService: PoolContractService;
  private readonly assetService: AssetService;
  constructor(private ledger: Ledger, principalAccount: string) {
    const context: ServiceContext = {
      ledger: this.ledger,
      principalAccount,
    };

    this.poolContractService = new PoolContractService(context);
    this.assetService = new AssetService(context, this.poolContractService);
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }

  get asset(): AssetService {
    return this.assetService;
  }
}
