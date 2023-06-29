import { ServiceContext } from "./serviceContext";
import { PoolInstanceService } from "./poolInstanceService";
import { withError } from "../common/withError";
import { AxtcContractService } from "./axtcContractService";

interface FetchAllContractsArgs {
  contractIds: string[];
}
export class PoolContractService {
  constructor(
    private context: ServiceContext,
    private masterContractService: AxtcContractService
  ) {}

  with(poolId: string): PoolInstanceService {
    return new PoolInstanceService(
      this.context,
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
