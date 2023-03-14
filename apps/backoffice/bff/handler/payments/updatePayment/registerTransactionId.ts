import { prisma } from "@axtp/db";
import { notFound, badRequest } from "@hapi/boom";
import { createLedgerClient } from "@/bff/createLedgerClient";
import { getEnvVar } from "@/bff/getEnvVar";
import { PaymentRecord, PaymentRecordService, PaymentType } from "@axtp/core";
import { Amount } from "@signumjs/util";

export async function registerTransactionId(id: any, body: any) {
  const { transactionId, status } = body;

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

  if (payment.transactionId) {
    throw badRequest(`Payment [${id}] has already a transaction id registered`);
  }

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

  const {
    poolId,
    tokenId,
    tokenQuantity,
    amount,
    usd,
    currency,
    type,
    customer,
    accountId,
  } = payment;

  if (payment.customer.blockchainAccounts.length === 0) {
    throw badRequest(
      `Customer [${payment.customer.cuid}] has no blockchain account yet`
    );
  }
  const publicKey = payment.customer.blockchainAccounts[0].publicKey;
  const record: PaymentRecord = {
    accountId,
    poolId,
    tokenId,
    tokenQuantity: tokenQuantity.toString(),
    paymentUsd: Number(usd || 0).toString(),
    paymentAmount: Number(amount || 0).toString(),
    paymentCurrency: currency || "",
    paymentTransactionId: transactionId,
    paymentType: type as PaymentType,
    customerId: customer.cuid,
  };

  const [recordTx] = await Promise.all([
    service.sendPaymentRecord(record, paymentRecordAccountPubKey),
    service.sendPaymentReceiptToCustomer(record, publicKey),
  ]);

  return prisma.payment.update({
    where: { id },
    data: {
      status,
      transactionId,
      recordId: recordTx?.transaction,
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
