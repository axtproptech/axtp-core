import { BurnContractService as BurnContractViewerService } from "@axtp/core/smartContractViewer";
import { ServiceContext } from "@/app/services/ledgerService/serviceContext";
import { Config } from "@/app/config";
import { Amount, ChainValue } from "@signumjs/util";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { withError } from "@axtp/core/common/withError";
import { MasterContractData } from "@/types/masterContractData";
import { MasterContractDataView } from "@/app/services/ledgerService/masterContractDataView";
import { BurnContractData } from "@/types/burnContractData";

export class BurnContractService extends BurnContractViewerService {
  constructor(private context: ServiceContext) {
    super(context.ledger, Config.BurnContract.Id);
  }
  public async readContractData(): Promise<BurnContractData> {
    return withError<BurnContractData>(async () => {
      const { ledger } = this.context;
      const [contract, trackedTokenIds, creditorAccountIds] = await Promise.all(
        [
          ledger.contract.getContract(this.contractId()),
          this.getTrackedTokenIds(),
          this.getCreditorAccounts(),
        ]
      );
      const trackableTokens = await Promise.all(
        trackedTokenIds.map((id) => this.getTokenData(id, true))
      );
      const tokenAccountCredits = await Promise.all(
        trackedTokenIds.map((id) => this.getTokenAccountCredits(id))
      );

      return {
        id: contract.at,
        balanceSigna: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        creditorAccountIds,
        trackableTokens,
        tokenAccountCredits,
      };
    });
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

  public async addCreditor(accountId: string) {
    return this.setCreditor(accountId, true);
  }

  public async removeCreditor(accountId: string) {
    return this.setCreditor(accountId, false);
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
