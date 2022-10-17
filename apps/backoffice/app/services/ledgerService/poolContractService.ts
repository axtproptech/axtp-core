import { ServiceContext } from "./serviceContext";
import { PoolInstanceService } from "./poolInstanceService";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { Config } from "@/app/config";
import {
  Amount,
  convertHexEndianess,
  convertHexStringToDecString,
  convertStringToHexString,
} from "@signumjs/util";
import { withError } from "./withError";
import { InputValidationService } from "@/app/services/inputValidationService";
import { MasterContractService } from "@/app/services/ledgerService/masterContractService";

interface CreatePoolInstanceArgs {
  documentationUrl: string;
  description: string;
  name: string;
  rate: number;
  quantity: number;
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

      PoolContractService.assertCreationArguments(args);

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
          activationAmountPlanck: Amount.fromSigna(
            Config.PoolContract.ActivationCosts
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
    return JSON.stringify({
      version: 1,
      description: args.description,
      documentation: args.documentationUrl,
    });
  }

  private static createInitialDataStack(args: CreatePoolInstanceArgs) {
    const name = convertHexStringToDecString(
      convertHexEndianess(convertStringToHexString(args.name))
    );
    return [0, 0, 0, 0, 0, name, args.rate, args.quantity];
  }

  private static assertCreationArguments(args: CreatePoolInstanceArgs) {
    InputValidationService.assertTextLessThan(args.description, 512);
    InputValidationService.assertTextLessThan(args.documentationUrl, 384);
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
