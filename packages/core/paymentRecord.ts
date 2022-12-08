import { Transaction } from "@signumjs/core";
import { DescriptorData, DescriptorDataBuilder } from "@signumjs/standards";
import { decryptMessage } from "@signumjs/crypto";

type PaymentType = "pix" | "usdeth" | "usdsol" | "usdalg";

interface RecordData {
  customerId: string;
  accountId: string;
  poolId: string;
  tokenQuantity: string;
  tokenId: string;
  paymentType: PaymentType;
  paymentTransactionId: string;
  paymentAmount: string;
}

export class PaymentRecord {
  private constructor(private d: DescriptorData) {}

  public static create(args: RecordData) {
    const data = DescriptorDataBuilder.create()
      .setAccount(args.accountId)
      .setCustomField("x-cuid", args.customerId)
      .setCustomField("x-pid", args.poolId)
      .setCustomField("x-tid", args.tokenId)
      .setCustomField("x-tqnt", args.tokenQuantity)
      .setCustomField("x-pt", args.paymentType)
      .setCustomField("x-pa", args.paymentAmount)
      .setCustomField("x-ptx", args.paymentTransactionId)
      .build();

    return new PaymentRecord(data);
  }

  get data(): RecordData {
    const cx = (k: string) => this.d.getCustomField(k) as string;

    return {
      accountId: this.d.account,
      customerId: cx("x-cuid"),
      poolId: cx("x-pid"),
      tokenId: cx("x-tid"),
      tokenQuantity: cx("x-tqnt"),
      paymentType: cx("x-pt") as PaymentType,
      paymentAmount: cx("x-pa"),
      paymentTransactionId: cx("x-ptx"),
    };
  }

  public static readFromTransaction(
    tx: Transaction,
    recipientPrivateKeyHex?: string
  ) {
    let message = tx.attachment.message || "";

    if (tx.attachment.encryptedMessage && recipientPrivateKeyHex) {
      message = decryptMessage(
        tx.attachment.encryptedMessage,
        tx.senderPublicKey,
        recipientPrivateKeyHex
      );
    }

    if (!message) {
      throw new Error("Could not read message");
    }
    return new PaymentRecord(DescriptorData.parse(message));
  }
}
