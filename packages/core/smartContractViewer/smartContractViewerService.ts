import { LedgerClientFactory } from "@signumjs/core";
import { AxtcContractService } from "./axtcContractService";
import { ServiceContext } from "./serviceContext";
import { PoolContractService } from "./poolContractService";

export class SmartContractViewerService {
  private readonly axtcContractService: AxtcContractService;
  private readonly poolContractService: PoolContractService;

  constructor(private nodeHost: string, private axtcContractId: string) {
    const ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    const context: ServiceContext = {
      ledger,
      axtcContractId,
    };

    this.axtcContractService = new AxtcContractService(context);
    this.poolContractService = new PoolContractService(
      context,
      this.axtcContractService
    );
  }

  get atxcContract(): AxtcContractService {
    return this.axtcContractService;
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }
}
