import { ServiceContext } from "./serviceContext";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import { InputValidationService } from "@/app/services/inputValidationService";
import { ConfirmedTransaction } from "@signumjs/wallets";
import {
  fromQuantity,
  toQuantity,
  toStableCoinAmount,
} from "@/app/tokenQuantity";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { UnconfirmedAssetBalance } from "@signumjs/core/out/typings/unconfirmedAssetBalance";

export abstract class GenericContractService {
  protected constructor(protected context: ServiceContext) {}

  public abstract contractId(): string;
  public abstract activationCosts(): Amount;
  public abstract interactionFee(): Amount;

  protected async getTokenBalances(): Promise<UnconfirmedAssetBalance[]> {
    try {
      const { ledger } = this.context;
      const account = await ledger.account.getAccount({
        accountId: this.contractId(),
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      });

      if (account) {
        return account.unconfirmedAssetBalances || [];
      }
    } catch (e) {
      // when a contract is not initialized, it's possible that this call fails...we ignore it
    }
    return [];
  }

  protected async getTokenData(tokenId: string): Promise<BasicTokenInfo> {
    if (!tokenId || tokenId === "0") {
      return Promise.resolve({
        name: "",
        id: "0",
        balance: "0",
        supply: "0",
      });
    }
    const { ledger } = this.context;
    const [assetInfo, tokenBalances] = await Promise.all([
      ledger.asset.getAsset({ assetId: tokenId }),
      this.getTokenBalances(),
    ]);

    const tokenBalance = tokenBalances.find(({ asset }) => tokenId === asset);
    let balance = "0";
    if (tokenBalance) {
      balance = fromQuantity(
        tokenBalance.unconfirmedBalanceQNT,
        assetInfo.decimals
      );
    }

    // TODO: adjust signumjs with new quantityCirculatingQNT
    // @ts-ignore
    const { name, asset: id, quantityCirculatingQNT } = assetInfo;
    return {
      name,
      id,
      balance,
      supply: fromQuantity(quantityCirculatingQNT, assetInfo.decimals),
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
          feePlanck: this.interactionFee().getPlanck(),
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
          feePlanck: this.interactionFee().getPlanck(),
          amountPlanck: this.activationCosts().getPlanck(),
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
