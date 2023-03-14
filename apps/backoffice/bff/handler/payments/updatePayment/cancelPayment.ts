import { createLedgerClient } from "@/bff/createLedgerClient";
import { getEnvVar } from "@/bff/getEnvVar";
import { PaymentRecord, PaymentRecordService, PaymentType } from "@axtp/core";
import { Amount } from "@signumjs/util";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";

export async function cancelPayment(id: any, body: any) {
  const { status, observations, transactionId: reference } = body;
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
  let payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      customer: {
        select: {
          cuid: true,
          blockchainAccounts: true,
        },
      },
    },
  });

  if (!payment) {
    throw notFound(`Payment [${id}] not found`);
  }

  const {
    poolId,
    tokenId,
    tokenQuantity,
    amount,
    usd,
    currency,
    transactionId,
    type,
    customer,
    accountId,
  } = payment;

  const publicKey = payment.customer.blockchainAccounts.length
    ? payment.customer.blockchainAccounts[0].publicKey
    : "";

  const record: PaymentRecord = {
    accountId,
    poolId,
    tokenId,
    tokenQuantity: tokenQuantity.toString(),
    paymentUsd: (-Number(usd || 0)).toString(),
    paymentAmount: (-Number(amount || 0)).toString(),
    paymentCurrency: currency || "",
    paymentTransactionId: transactionId,
    paymentType: type as PaymentType,
    customerId: customer.cuid,
  };

  const [recordTx] = await Promise.all([
    service.sendPaymentRecord(record, paymentRecordAccountPubKey),
    publicKey
      ? service.sendPaymentCancellationReceiptToCustomer(record, publicKey)
      : Promise.resolve(null),
  ]);

  return prisma.payment.update({
    where: { id },
    data: {
      status,
      cancelTransactionId: reference, // this is the reimbursement payment id, i.e. pix, usdeth, etc.
      cancelRecordId: recordTx.transaction,
      observations,
    },
    include: {
      customer: {
        select: {
          cuid: true,
        },
      },
    },
  });
}
