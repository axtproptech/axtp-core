import { PoolInstanceService } from "./poolInstanceService";
import { withError } from "../common/withError";
import { AxtcContractService } from "./axtcContractService";
import { Ledger } from "@signumjs/core";

interface FetchAllContractsArgs {
  contractIds: string[];
}
export class PoolContractService {
  constructor(
    private ledger: Ledger,
    private masterContractService: AxtcContractService
  ) {}

  with(poolId: string): PoolInstanceService {
    return new PoolInstanceService(
      this.ledger,
      this.masterContractService,
      poolId
    );
  }

  async fetchContracts({ contractIds }: FetchAllContractsArgs) {
    return withError(async () => {
      const promises = contractIds.map((poolId) =>
        this.with(poolId).readContractData()
      );
      const allContracts = await Promise.all(promises);
      return allContracts.filter((c) => !c.isDeactivated);
    });
  }
}
