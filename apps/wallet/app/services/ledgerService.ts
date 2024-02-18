import { Ledger } from "@signumjs/core";
import { ServiceContext } from "./serviceContext";
import { PoolContractService } from "./poolContractService";
import { AssetService } from "./assetService";
import { BurnContractService } from "@/app/services/burnContractService";

export class LedgerService {
  private readonly poolContractService: PoolContractService;
  private readonly burnContractService: BurnContractService;
  private readonly assetService: AssetService;

  constructor(private ledger: Ledger, principalAccount: string) {
    const context: ServiceContext = {
      ledger: this.ledger,
      principalAccount,
    };

    this.poolContractService = new PoolContractService(context);
    this.burnContractService = new BurnContractService(context);
    this.assetService = new AssetService(context, this.poolContractService);
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }

  get asset(): AssetService {
    return this.assetService;
  }

  get burnContract(): BurnContractService {
    return this.burnContractService;
  }
}
