import { LedgerClientFactory } from "@signumjs/core";
import { AxtcContractService } from "./axtcContractService";
import { PoolContractService } from "./poolContractService";
import { BurnContractService } from "./burnContractService";

export class SmartContractViewerService {
  private readonly axtcContractService: AxtcContractService;
  private readonly poolContractService: PoolContractService;
  private readonly burnContractService: BurnContractService;

  constructor(
    private nodeHost: string,
    private axtcContractId: string,
    private burnContractId: string
  ) {
    const ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    this.axtcContractService = new AxtcContractService(ledger, axtcContractId);
    this.burnContractService = new BurnContractService(ledger, burnContractId);
    this.poolContractService = new PoolContractService(
      ledger,
      this.axtcContractService
    );
  }

  get axtcContract(): AxtcContractService {
    return this.axtcContractService;
  }

  get poolContract(): PoolContractService {
    return this.poolContractService;
  }

  get burnContract(): BurnContractService {
    return this.burnContractService;
  }
}
