import { ServiceContext } from "./ServiceContext";
import { Config } from "@/app/config";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import {
  ApprovalStatus,
  MasterContractDataView,
} from "./MasterContractDataView";

const ContractId = Config.MasterContract.Id;
const ActivationCostsPlanck = Amount.fromSigna(
  Config.MasterContract.ActivationCosts
).getPlanck();
const InteractionFeePlanck = Amount.fromSigna(
  Config.MasterContract.InteractionFee
).getPlanck();

interface ContractData {
  balance: Amount;
  tokenId: string;
  currentSendPoolAddress: string;
  approvalStatusMinting: ApprovalStatus;
  approvalStatusBurning: ApprovalStatus;
  approvalStatusSendToPool: ApprovalStatus;
}

export class MasterContractService {
  constructor(private context: ServiceContext) {}

  public async readContractData() {
    return withError<ContractData>(async () => {
      const { ledger } = this.context;
      const contract = await ledger.contract.getContract(ContractId);
      const contractDataView = new MasterContractDataView(contract);
      return {
        balance: Amount.fromPlanck(contract.balanceNQT),
        tokenId: contractDataView.getTokenId(),
        currentSendPoolAddress: contractDataView.getCurrentPoolAddress(),
        approvalStatusBurning: contractDataView.getBurningApprovalStatus(),
        approvalStatusMinting: contractDataView.getMintingApprovalStatus(),
        approvalStatusSendToPool:
          contractDataView.getSendingToPoolApprovalStatus(),
      };
    });
  }

  public async getTokenData(tokenId: string) {
    return withError(async () => {
      const { ledger } = this.context;
      return ledger.asset.getAsset(tokenId);
    });
  }

  public async rechargeContract(amount: Amount) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.transaction.sendAmountToSingleRecipient({
          recipientId: ContractId,
          feePlanck: Amount.fromSigna(0.01).getSigna(),
          amountPlanck: amount.getPlanck(),
          senderPublicKey: accountPublicKey,
        });
      await wallet.confirm(unsignedTransactionBytes);
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

  private callMethod(method: string, ...args: any[]) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          senderPublicKey: accountPublicKey,
          feePlanck: InteractionFeePlanck,
          amountPlanck: ActivationCostsPlanck,
          contractId: ContractId,
          methodHash: method,
          methodArgs: args,
        });
      return wallet.confirm(unsignedTransactionBytes);
    });
  }
}
