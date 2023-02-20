import { createLedgerClient } from "@/bff/createLedgerClient";
import { PaymentRecordService, PaymentRecord } from "@axtp/core";
import { Amount } from "@signumjs/util";
import { getEnvVar } from "@/bff/getEnvVar";
import { Address, TransactionId } from "@signumjs/core";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { prisma } from "@axtp/db";
export const recordPayment = async (
  args: RegisterPaymentRequest
): Promise<TransactionId> => {
  const {
    customerId,
    accountPk,
    poolId,
    tokenId,
    tokenQnt,
    amount,
    paymentType,
    txId,
  } = args;

  const ledger = createLedgerClient();

  const senderSeed = getEnvVar("NEXT_SERVER_PRINCIPAL_SIGNUM_ACCOUNT_SECRET");
  const paymentRecordAccountPubKey = getEnvVar(
    "NEXT_SERVER_PAYMENT_SIGNUM_ACCOUNT_PUBKEY"
  );
  const sendFeeSigna = parseFloat(getEnvVar("NEXT_SERVER_SIGNUM_SEND_FEE"));

  const service = new PaymentRecordService({
    ledger,
    senderSeed,
    sendFee: Amount.fromSigna(sendFeeSigna),
  });

  const record: PaymentRecord = {
    accountId: Address.fromPublicKey(accountPk).getNumericId(),
    poolId,
    tokenId,
    tokenQuantity: tokenQnt,
    paymentAmount: amount,
    paymentTransactionId: txId,
    paymentType,
    customerId,
  };

  const [recordTx] = await Promise.all([
    service.sendPaymentRecord(record, paymentRecordAccountPubKey),
    service.sendPaymentReceiptToCustomer(record, accountPk),
  ]);

  await prisma.payment.create({
    data: {
      tokenId,
      tokenQuantity: parseFloat(tokenQnt),
      poolId,
      accountId: record.accountId,
      amount,
      status: "Pending",
      type: paymentType,
      transactionId: txId,
      recordId: recordTx.transaction,
      customer: {
        connect: {
          cuid: customerId,
        },
      },
    },
  });

  return recordTx;
};
