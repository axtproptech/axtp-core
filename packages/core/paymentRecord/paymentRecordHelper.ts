import { Transaction } from "@signumjs/core";
import { DescriptorData, DescriptorDataBuilder } from "@signumjs/standards";
import { decryptMessage } from "@signumjs/crypto";
import { PaymentRecord, PaymentType } from "./paymentRecord";

export function createSRC44PaymentRecord(args: PaymentRecord): DescriptorData {
  return DescriptorDataBuilder.create()
    .setAccount(args.accountId)
    .setCustomField("x-cuid", args.customerId)
    .setCustomField("x-pid", args.poolId)
    .setCustomField("x-tid", args.tokenId)
    .setCustomField("x-tqnt", args.tokenQuantity)
    .setCustomField("x-pt", args.paymentType)
    .setCustomField("x-pa", args.paymentAmount)
    .setCustomField("x-ptx", args.paymentTransactionId)
    .build();
}

export function getPaymentRecordFromSRC44(
  descriptor: DescriptorData
): PaymentRecord {
  const cx = (k: string) => descriptor.getCustomField(k) as string;

  return {
    accountId: descriptor.account,
    customerId: cx("x-cuid"),
    poolId: cx("x-pid"),
    tokenId: cx("x-tid"),
    tokenQuantity: cx("x-tqnt"),
    paymentType: cx("x-pt") as PaymentType,
    paymentAmount: cx("x-pa"),
    paymentTransactionId: cx("x-ptx"),
  };
}

export function readSRC44PaymentFromTransaction(
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
  return DescriptorData.parse(message);
}
