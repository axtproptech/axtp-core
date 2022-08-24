import { AssetApi, Ledger, LedgerClientFactory } from "@signumjs/core";
import { ServiceContext } from "./serviceContext";
import { PoolContractService } from "./poolContractService";

export class LedgerService {
  private readonly ledger: Ledger;
  private readonly poolContractService: PoolContractService;

  constructor(private nodeHost: string, private accountPublicKey: string) {
    this.ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    const context: ServiceContext = {
      ledger: this.ledger,
      accountPublicKey,
    };

    this.poolContractService = new PoolContractService(context);
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }
}
