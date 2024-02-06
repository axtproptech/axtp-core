import { BurnContractService as BurnContractViewerService } from "@axtp/core/smartContractViewer";
import { ServiceContext } from "@/app/services/ledgerService/serviceContext";
import { Config } from "@/app/config";
import { withError } from "@/app/services/ledgerService/withError";
import { Amount, ChainValue } from "@signumjs/util";
import { ConfirmedTransaction } from "@signumjs/wallets";

// Using the new package already
export class BurnContractService extends BurnContractViewerService {
  constructor(private context: ServiceContext) {
    super(context.ledger, Config.BurnContract.Id);
  }

  async addTrackableToken(tokenId: string) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          contractId: this.contractId(),
          methodHash: Config.BurnContract.Methods.AddTrackableToken,
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

  async removeTrackableToken(tokenId: string) {
    return withError(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        await ledger.contract.callContractMethod({
          contractId: this.contractId(),
          methodHash: Config.BurnContract.Methods.RemoveTrackableToken,
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
