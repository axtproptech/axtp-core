import { Ledger } from "@signumjs/core";
import { ServiceContext } from "./serviceContext";
import { PoolContractService } from "./poolContractService";

export class LedgerService {
  private readonly poolContractService: PoolContractService;

  constructor(private ledger: Ledger, private accountId: string) {
    const context: ServiceContext = {
      ledger: this.ledger,
      accountId,
    };

    this.poolContractService = new PoolContractService(context);
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }
}
