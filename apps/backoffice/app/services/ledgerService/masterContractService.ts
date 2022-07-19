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
      const [token, transactions] = await Promise.all([
        this.getTokenData(contractDataView.getTokenId()),
        ledger.account.getAccountTransactions({ accountId: ContractId }),
      ]);
      return {
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        transactions: transactions.transactions,
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
    const [assetInfo, accountInfo] = await Promise.all([
      ledger.asset.getAsset(tokenId),
      ledger.account.getAccount({
        accountId: ContractId,
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      }),
    ]);

    const assetBalance =
      accountInfo.assetBalances &&
      accountInfo.assetBalances.find(({ asset }) => tokenId === asset);
    let quantity = "0";
    if (assetBalance) {
      quantity = toStableCoinAmount(assetBalance.balanceQNT);
    }
    // TODO: adjust signumjs with new quantityCirculatingQNT
    // @ts-ignore
    const { name, asset, quantityCirculatingQNT } = assetInfo;
    return {
      name,
      id: asset,
      quantity,
      supply: toStableCoinAmount(quantityCirculatingQNT),
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
    InputValidationService.assertNumberGreaterOrEqualThan(0.1, quantity);
    return this.callMethod(Config.MasterContract.Methods.RequestMint, quantity);
  }

  public async approveMint() {
    return this.callMethod(Config.MasterContract.Methods.ApproveMint);
  }

  public async requestBurn(quantity: number) {
    InputValidationService.assertNumberGreaterOrEqualThan(0.1, quantity);
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
      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }
}
