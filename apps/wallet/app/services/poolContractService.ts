import { ServiceContext } from "./serviceContext";
import { PoolInstanceService } from "./poolInstanceService";

export class PoolContractService {
  constructor(private context: ServiceContext) {}

  with(poolId: string): PoolInstanceService {
    return new PoolInstanceService(this.context, poolId);
  }

  // async fetchAllContracts() {
  //   return withError(async () => {
  //     const { ledger } = this.context;
  //     const poolIds = await ledger.contract.getAllContractIds({
  //       machineCodeHash: Config.PoolContract.CodeHash,
  //     });
  //     const promises = poolIds.atIds.map((poolId) =>
  //       this.with(poolId).readContractData()
  //     );
  //     return Promise.all(promises);
  //   });
  // }
}
