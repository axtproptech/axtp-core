import { ServiceContext } from "@/app/services/serviceContext";
import { tryCall, withError } from "@axtp/core";
import { TransactionId } from "@signumjs/core";
import { hashSHA256, Keys } from "@signumjs/crypto";
import { Amount } from "@signumjs/util";
import { DescriptorDataBuilder } from "@signumjs/standards";
import { PoolContractService } from "@/app/services/poolContractService";
import { SignableDocument } from "@/types/signableDocument";
import { SignableDocumentType } from "@/types/signableDocumentType";

interface SignArgs {
  cuid: string;
  senderKeys: Keys;
  type: SignableDocumentType;
  documentHash: string;
}

interface FetchTermsArgs {
  type: SignableDocumentType;
  poolId: string;
  locale: string;
}

export class TermsSigningService {
  private poolService: PoolContractService;

  constructor(private context: ServiceContext) {
    this.poolService = new PoolContractService(context);
  }

  private documentUrl(
    type: SignableDocumentType,
    locale: string,
    poolName: string
  ) {
    const baseUrl = `/assets/docs/${locale}/`;
    switch (type) {
      case "TermsOfRisk":
        return baseUrl + `acquisition-terms-${poolName.toLowerCase()}.md`;
      case "SelfDeclaration10K":
        return baseUrl + `declaration10k-terms.md`;
      case "SelfDeclaration100K":
        return baseUrl + `declaration100k-terms.md`;
      case "SelfDeclaration1M":
        return baseUrl + `declaration1M-terms.md`;
      default:
        throw new Error("Unknown document type: " + type);
    }
  }

  async fetchSignableDocument({ poolId, type, locale }: FetchTermsArgs) {
    const poolData = await this.poolService.with(poolId).readContractData();

    const url = this.documentUrl(type, locale, poolData.token.name);
    return tryCall<SignableDocument>(async () => {
      const response = await fetch(url);
      const text = await response.text();
      return {
        url,
        type,
        documentHash: hashSHA256(text),
        text,
      } as SignableDocument;
    });
  }

  async sign(args: SignArgs) {
    return withError(() => {
      const { publicKey, signPrivateKey, agreementPrivateKey } =
        args.senderKeys;

      const data = DescriptorDataBuilder.create()
        .setCustomField("x-cuid", args.cuid)
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
