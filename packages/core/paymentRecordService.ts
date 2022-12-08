import {
  Address,
  Ledger,
  TransactionArbitrarySubtype,
  TransactionId,
  TransactionType,
} from "@signumjs/core";
import { PaymentRecord } from "./paymentRecord";
import { generateMasterKeys } from "@signumjs/crypto";
import { Amount, ChainValue } from "@signumjs/util";

interface PaymentRecordServiceContext {
  ledger: Ledger;
  senderSeed: string;
  sendFee: Amount;
}

export class PaymentRecordService {
  constructor(private context: PaymentRecordServiceContext) {}

  private getKeys() {
    return generateMasterKeys(this.context.senderSeed);
  }

  public async sendPaymentRecord(
    record: PaymentRecord,
    recipientPublicKey: string
  ) {
    const { publicKey, signPrivateKey, agreementPrivateKey } = this.getKeys();

    return this.context.ledger.message.sendEncryptedMessage({
      message: JSON.stringify(record.data),
      messageIsText: true,
      recipientId: Address.fromPublicKey(recipientPublicKey).getNumericId(),
      recipientPublicKey: recipientPublicKey,
      deadline: 1440,
      feePlanck: this.context.sendFee.getPlanck(),
      senderPublicKey: publicKey,
      senderPrivateKey: signPrivateKey,
      senderAgreementKey: agreementPrivateKey,
    });
  }

  public async getAllPaymentRecords(
    recipientPublicKey: string,
    recipientAgreementKey: string
  ) {
    const { ledger } = this.context;
    const accountId = Address.fromPublicKey(recipientPublicKey).getNumericId();

    let records: PaymentRecord[] = [];
    let hasMore = true;
    let firstIndex = 0;
    let lastIndex = 499;
    while (hasMore) {
      const { transactions } = await ledger.account.getAccountTransactions({
        type: TransactionType.Arbitrary,
        subtype: TransactionArbitrarySubtype.Message,
        includeIndirect: false,
        firstIndex,
        lastIndex,
        accountId,
      });

      for (let tx of transactions) {
        try {
          records.push(
            PaymentRecord.readFromTransaction(tx, recipientAgreementKey)
          );
        } catch (e: any) {
          // ignore
        }
      }

      hasMore = transactions.length === 500;
      firstIndex = lastIndex + 1;
      lastIndex += 499;
    }

    return records;
  }

  public async sendPaymentReceiptToCustomer(
    record: PaymentRecord,
    customerPublicKey: string
  ) {
    const { ledger, sendFee } = this.context;
    const { publicKey, signPrivateKey, agreementPrivateKey } = this.getKeys();
    const { tokenId, tokenQuantity } = record.data;
    const { name, decimals } = await ledger.asset.getAsset({
      assetId: tokenId,
    });
    const tokenAmount = ChainValue.create(decimals)
      .setAtomic(tokenQuantity)
      .getCompound();
    const message =
      parseFloat(tokenAmount) > 1
        ? `Thank you for purchasing ${tokenAmount} ${name} tokens. You'll get them credited very soon.`
        : `Thank you for purchasing a ${name} token. You'll get it credited very soon.`;

    return ledger.message.sendEncryptedMessage({
      message,
      messageIsText: true,
      recipientId: Address.fromPublicKey(customerPublicKey).getNumericId(),
      recipientPublicKey: customerPublicKey,
      deadline: 1440,
      feePlanck: sendFee.getPlanck(),
      senderPublicKey: publicKey,
      senderPrivateKey: signPrivateKey,
      senderAgreementKey: agreementPrivateKey,
    }) as Promise<TransactionId>;
  }
}
