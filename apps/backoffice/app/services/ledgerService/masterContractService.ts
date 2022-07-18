import { ServiceContext } from "./serviceContext";
import { Config } from "@/app/config";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import { MasterContractDataView } from "./masterContractDataView";
import { InputValidationService } from "@/app/services/inputValidationService";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { MasterContractData, TokenInfo } from "@/types/masterContractData";
import { toStableCoinAmount } from "@/app/tokenQuantity";

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
    return withError<MasterContractData>(async () => {
      const { ledger } = this.context;
      const contract = await ledger.contract.getContract(ContractId);
      const contractDataView = new MasterContractDataView(contract);
      const token = await this.getTokenData(contractDataView.getTokenId());
      return {
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        currentSendPoolAddress: contractDataView.getCurrentPoolAddress(),
        approvalStatusBurning: contractDataView.getBurningApprovalStatus(),
        approvalStatusMinting: contractDataView.getMintingApprovalStatus(),
        approvalStatusSendToPool:
          contractDataView.getSendingToPoolApprovalStatus(),
      };
    });
  }

  private async getTokenData(tokenId: string): Promise<TokenInfo> {
    const { ledger } = this.context;
    const assetInfo = await ledger.asset.getAsset(tokenId);
    // TODO: adjust signumjs with new quantityCirculatingQNT
    // @ts-ignore
    const { name, asset, quantityQNT, quantityCirculatingQNT } = assetInfo;
    return {
      name,
      id: asset,
      supply: toStableCoinAmount(quantityCirculatingQNT),
      quantity: toStableCoinAmount(quantityQNT),
    };
  }

  public async rechargeContract(amount: Amount) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      InputValidationService.assertAmountGreaterThan(
        Amount.fromSigna(1),
        amount
      );

      const { unsignedTransactionBytes } =
        await ledger.transaction.sendAmountToSingleRecipient({
          recipientId: ContractId,
          feePlanck: InteractionFeePlanck,
          amountPlanck: amount.getPlanck(),
          senderPublicKey: accountPublicKey,
        });

      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
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
