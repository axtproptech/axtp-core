import { ServiceContext } from "@/app/services/serviceContext";
import { withError } from "@axtp/core";
import { TransactionId } from "@signumjs/core";
import { Keys } from "@signumjs/crypto";
import { Amount } from "@signumjs/util";
import { DescriptorDataBuilder } from "@signumjs/standards";
interface SignArgs {
  senderKeys: Keys;
  type: string;
  documentHash: string;
}

export class TermsSigningService {
  constructor(private context: ServiceContext) {}

  async sign(args: SignArgs) {
    return withError(() => {
      const { publicKey, signPrivateKey, agreementPrivateKey } =
        args.senderKeys;

      const data = DescriptorDataBuilder.create()
        .setCustomField("x-cuid", args.type)
        .setCustomField("x-trms", args.type)
        .setCustomField("x-dhsh", args.documentHash)
        .build()
        .stringify();

      return this.context.ledger.message.sendEncryptedMessage({
        senderPublicKey: publicKey,
        senderAgreementKey: agreementPrivateKey,
        senderPrivateKey: signPrivateKey,
        feePlanck: Amount.fromSigna(0.02).getPlanck(),
        recipientId: this.context.signAccount.id,
        recipientPublicKey: this.context.signAccount.publicKey,
        message: data,
      }) as Promise<TransactionId>;
    });
  }
}
