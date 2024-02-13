import { Transaction } from "@signumjs/core";
import { DescriptorData, DescriptorDataBuilder } from "@signumjs/standards";
import { decryptMessage } from "@signumjs/crypto";
import { WithdrawalRecord, WithdrawalPaymentType } from "./withdrawalRecord";

export function createSRC44WithdrawalRecord(
  args: WithdrawalRecord
): DescriptorData {
  return DescriptorDataBuilder.create()
    .setAccount(args.accountId)
    .setCustomField("x-cuid", args.customerId)
    .setCustomField("x-tid", args.tokenId)
    .setCustomField("x-tqnt", args.tokenQuantity)
    .setCustomField("x-tnm", args.tokenName)
    .setCustomField("x-pt", args.paymentType)
    .setCustomField("x-pa", args.paymentAmount)
    .setCustomField("x-usd", args.paymentUsd)
    .setCustomField("x-cur", args.paymentCurrency)
    .setCustomField("x-ptx", args.paymentTransactionId)
    .build();
}

export function getWithdrawalRecordFromSRC44(
  descriptor: DescriptorData
): WithdrawalRecord {
  const cx = (k: string) => descriptor.getCustomField(k) as string;

  return {
    accountId: descriptor.account,
    customerId: cx("x-cuid"),
    tokenId: cx("x-tid"),
    tokenQuantity: cx("x-tqnt"),
    tokenName: cx("x-tnm"),
    paymentType: cx("x-pt") as WithdrawalPaymentType,
    paymentAmount: cx("x-pa"),
    paymentCurrency: cx("x-cur"),
    paymentUsd: cx("x-usd"),
    paymentTransactionId: cx("x-ptx"),
  };
}

export function readSRC44WithdrawalFromTransaction(
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
