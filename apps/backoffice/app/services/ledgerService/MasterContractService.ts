import { ServiceContext } from "./ServiceContext";
import { Config } from "@/app/config";
import { withError } from "./withError";
import { UnsignedTransaction } from "@signumjs/core";
import { Amount } from "@signumjs/util";

const ContractId = Config.MasterContract.Id;
const ActivationCostsPlanck = Amount.fromSigna(
  Config.MasterContract.ActivationCosts
).getPlanck();
const InteractionFeePlanck = Amount.fromSigna(
  Config.MasterContract.InteractionFee
).getPlanck();

export class MasterContractService {
  constructor(private context: ServiceContext) {}

  public async readContractData() {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const contract = await ledger.contract.getContract(ContractId);
    });
  }

  private callMethod(method: string, ...args: any[]) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        (await ledger.contract.callContractMethod({
          senderPublicKey: accountPublicKey,
          feePlanck: InteractionFeePlanck,
          amountPlanck: ActivationCostsPlanck,
          contractId: ContractId,
          methodHash: method,
          methodArgs: args,
        })) as UnsignedTransaction;
      return wallet.confirm(unsignedTransactionBytes);
    });
  }

  public async requestMint(quantity: number) {
    return this.callMethod(Config.MasterContract.Methods.RequestMint, quantity);
  }

  public async approveMint() {
    return this.callMethod(Config.MasterContract.Methods.ApproveMint);
  }

  public async requestBurn(quantity: number) {
    return this.callMethod(Config.MasterContract.Methods.RequestBurn, quantity);
  }

  public async approveBurn() {
    return this.callMethod(Config.MasterContract.Methods.ApproveBurn);
  }

  public async requestSendToPool(quantity: number, poolId: string) {
    return this.callMethod(
      Config.MasterContract.Methods.RequestSendToPool,
      quantity,
      poolId
    );
  }

  public async approveSendToPool() {
    return this.callMethod(Config.MasterContract.Methods.ApproveSendToPool);
  }
}
