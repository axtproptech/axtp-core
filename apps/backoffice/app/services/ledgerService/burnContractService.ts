import { BurnContractService as BurnContractViewerService } from "@axtp/core/smartContractViewer";
import { ServiceContext } from "@/app/services/ledgerService/serviceContext";
import { Config } from "@/app/config";
import { Amount, ChainValue } from "@signumjs/util";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { withError } from "@axtp/core/common/withError";

export class BurnContractService extends BurnContractViewerService {
  constructor(private context: ServiceContext) {
    super(context.ledger, Config.BurnContract.Id);
  }

  async addTrackableToken(tokenId: string) {
    return this.setTrackableToken(tokenId, true);
  }

  async removeTrackableToken(tokenId: string) {
    return this.setTrackableToken(tokenId, false);
  }

  private async setTrackableToken(tokenId: string, enabled: boolean) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          contractId: this.contractId(),
          methodHash: enabled
            ? Config.BurnContract.Methods.AddTrackableToken
            : Config.BurnContract.Methods.RemoveTrackableToken,
          methodArgs: [tokenId],
          senderPublicKey: accountPublicKey,
          amountPlanck: Amount.fromSigna(
            Config.PoolContract.ActivationCosts
          ).getPlanck(),
          feePlanck: Amount.fromSigna(
            Config.BurnContract.InteractionFee
          ).getPlanck(),
        });
      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }

  private async setCreditor(accountId: string, enabled: boolean) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          contractId: this.contractId(),
          methodHash: enabled
            ? Config.BurnContract.Methods.AddCreditor
            : Config.BurnContract.Methods.RemoveCreditor,
          methodArgs: [accountId],
          senderPublicKey: accountPublicKey,
          amountPlanck: Amount.fromSigna(
            Config.PoolContract.ActivationCosts
          ).getPlanck(),
          feePlanck: Amount.fromSigna(
            Config.BurnContract.InteractionFee
          ).getPlanck(),
        });
      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }

  async creditToken(
    tokenId: string,
    tokenAmount: ChainValue,
    accountId: string
  ) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          contractId: this.contractId(),
          methodHash: Config.BurnContract.Methods.CreditTrackableToken,
          methodArgs: [tokenId, tokenAmount.getCompound(), accountId],
          senderPublicKey: accountPublicKey,
          amountPlanck: Amount.fromSigna(
            Config.PoolContract.ActivationCosts
          ).getPlanck(),
          feePlanck: Amount.fromSigna(
            Config.BurnContract.InteractionFee
          ).getPlanck(),
        });
      return (await wallet.confirm(
        unsignedTransactionBytes
      )) as ConfirmedTransaction;
    });
  }
}
