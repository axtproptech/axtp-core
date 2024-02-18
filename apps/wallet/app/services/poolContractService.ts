import { ServiceContext } from "./serviceContext";
import { PoolInstanceService } from "./poolInstanceService";
import { Config } from "@/app/config";
import { PoolContractData } from "@/types/poolContractData";
import { withError } from "@axtp/core/common/withError";

export class PoolContractService {
  constructor(private context: ServiceContext) {}

  with(poolId: string): PoolInstanceService {
    return new PoolInstanceService(this.context, poolId);
  }

  async fetchAllContracts(): Promise<PoolContractData[]> {
    return withError(async () => {
      const promises = Config.Contracts.PoolContractIds.map((poolId) =>
        this.with(poolId).readContractData()
      );
      return Promise.all(promises);
    });
  }
}
