import { ServiceContext } from "./serviceContext";
import { PoolInstanceService } from "./poolInstanceService";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { DescriptorDataBuilder } from "@signumjs/standards";
import { Config } from "@/app/config";
import {
  Amount,
  convertHexEndianess,
  convertHexStringToDecString,
  convertStringToHexString,
} from "@signumjs/util";
import { MasterContractService } from "./masterContractService";
import { withError } from "@axtp/core/common/withError";

interface CreatePoolInstanceArgs {
  alias: string;
  description: string;
  name: string;
  rate: number;
  quantity: number;
  isPublic: 0 | 1;
  goal: number;
}

export class PoolContractService {
  constructor(
    private context: ServiceContext,
    private masterContractService: MasterContractService
  ) {}

  with(poolId: string): PoolInstanceService {
    return new PoolInstanceService(
      this.context,
      this.masterContractService,
      poolId
    );
  }

  async createPoolInstance(args: CreatePoolInstanceArgs) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;

      const description = PoolContractService.createDescriptor(args);
      const data = PoolContractService.createInitialDataStack(args);

      const { unsignedTransactionBytes } =
        await ledger.contract.publishContractByReference({
          senderPublicKey: accountPublicKey,
          description,
          referencedTransactionHash: Config.PoolContract.Reference,
          feePlanck: Amount.fromSigna(
            Config.PoolContract.CreationCosts
          ).getPlanck(),
          name: `${Config.PoolContract.Basename}${args.name}`,
          data,
        });
      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }

  private static createDescriptor(args: CreatePoolInstanceArgs) {
    return DescriptorDataBuilder.create(args.name)
      .setType("smc")
      .setDescription(args.description)
      .setAlias(args.alias)
      .setCustomField("x-pub", args.isPublic.toString())
      .setCustomField("x-goal", args.goal.toString())
      .build()
      .stringify();
  }

  private static createInitialDataStack(args: CreatePoolInstanceArgs) {
    const name = convertHexStringToDecString(
      convertHexEndianess(convertStringToHexString(args.name))
    );
    return [0, 0, 0, 0, 0, name, args.rate, args.quantity];
  }

  async fetchAllContracts() {
    return withError(async () => {
      const { ledger } = this.context;
      const poolIds = await ledger.contract.getAllContractIds({
        machineCodeHash: Config.PoolContract.CodeHash,
      });
      const promises = poolIds.atIds
        .filter((poolId) => poolId !== Config.PoolContract.OriginId)
        .map((poolId) => this.with(poolId).readContractData());
      const allContracts = await Promise.all(promises);
      return allContracts.filter((c) => !c.isDeactivated);
    });
  }
}
