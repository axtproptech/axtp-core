import { BurnContractService as BurnContractViewerService } from "@axtp/core/smartContractViewer";
import { Config } from "@/app/config";
import { ServiceContext } from "./serviceContext";
import { Amount, ChainValue } from "@signumjs/util";
import { Keys } from "@signumjs/crypto";
import { withError } from "@axtp/core/common/withError";

interface RequestWithdrawalArgs {
  tokenId: string;
  amount: ChainValue;
  keys: Keys;
}

export class BurnContractService extends BurnContractViewerService {
  constructor(private context: ServiceContext) {
    super(context.ledger, Config.Contracts.BurnContract.Id);
  }

  requestWithdrawal({ amount, tokenId, keys }: RequestWithdrawalArgs) {
    return withError(() => {
      return this.context.ledger.asset.transferAsset({
        assetId: tokenId,
        amountPlanck: Amount.fromSigna(
          Config.Contracts.BurnContract.ActivationFee
        ).getPlanck(),
        feePlanck: Amount.fromSigna(0.01).getPlanck(),
        senderPublicKey: keys.publicKey,
        senderPrivateKey: keys.signPrivateKey,
        quantity: amount.getAtomic(),
        recipientId: Config.Contracts.BurnContract.Id,
      });
    });
  }
}
