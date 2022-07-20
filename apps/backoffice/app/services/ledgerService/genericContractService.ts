import { ServiceContext } from "./serviceContext";
import { Config } from "@/app/config";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import { InputValidationService } from "@/app/services/inputValidationService";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { fromQuantity, toStableCoinAmount } from "@/app/tokenQuantity";
import { BasicTokenInfo } from "@/types/basicTokenInfo";

const ActivationCostsPlanck = Amount.fromSigna(
  Config.MasterContract.ActivationCosts
).getPlanck();
const InteractionFeePlanck = Amount.fromSigna(
  Config.MasterContract.InteractionFee
).getPlanck();

export abstract class GenericContractService {
  protected constructor(protected context: ServiceContext) {}

  public abstract contractId(): string;

  protected async getTokenData(tokenId: string): Promise<BasicTokenInfo> {
    const { ledger } = this.context;
    const [assetInfo, accountInfo] = await Promise.all([
      ledger.asset.getAsset(tokenId),
      ledger.account.getAccount({
        accountId: this.contractId(),
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      }),
    ]);

    const assetBalance =
      accountInfo.assetBalances &&
      accountInfo.assetBalances.find(({ asset }) => tokenId === asset);
    let quantity = "0";
    if (assetBalance) {
      quantity = fromQuantity(assetBalance.balanceQNT, assetInfo.decimals);
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
          recipientId: this.contractId(),
          feePlanck: InteractionFeePlanck,
          amountPlanck: amount.getPlanck(),
          senderPublicKey: accountPublicKey,
        });

      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }

  protected callMethod(method: string, ...args: any[]) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          senderPublicKey: accountPublicKey,
          feePlanck: InteractionFeePlanck,
          amountPlanck: ActivationCostsPlanck,
          contractId: this.contractId(),
          methodHash: method,
          methodArgs: args,
        });
      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }
}
