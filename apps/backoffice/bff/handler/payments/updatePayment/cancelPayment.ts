import { createLedgerClient } from "@/bff/createLedgerClient";
import { getEnvVar } from "@/bff/getEnvVar";
import {
  PaymentRecord,
  PaymentRecordService,
  PaymentType,
} from "@axtp/core/paymentRecord";
import { Amount } from "@signumjs/util";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { mailService } from "@/bff/services/backofficeMailService";

async function sendCancellationMails(
  payment: any,
  reason: string,
  tokenName: string
) {
  try {
    await Promise.all([
      mailService.internal.sendPaymentCancellation({
        params: {
          reason: payment.observations,
          firstName: payment.customer.firstName,
          lastName: payment.customer.lastName,
          email: payment.customer.email1,
          phone: payment.customer.phone1,
          amount: payment.amount.toString(),
          currency: payment.currency || "",
          paymentId: payment.id.toString(),
          tokenQuantity: payment.tokenQuantity.toString(),
          tokenName,
        },
      }),
      mailService.external.sendPaymentCancellation({
        to: {
          firstName: payment.customer.firstName,
          lastName: payment.customer.lastName,
          email1: payment.customer.email1,
        },
        params: {
          firstName: payment.customer.firstName,
          lastName: payment.customer.lastName,
          poolId: payment.poolId,
          tokenName,
          tokenQnt: payment.tokenQuantity.toString(),
          reason: reason,
        },
      }),
    ]);
  } catch (e) {
    console.error("Sending cancellation mails failed", e);
  }
}

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
  const payment = await prisma.payment.findUnique({
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
    paymentTransactionId: transactionId || "",
    paymentType: type as PaymentType,
    customerId: customer.cuid,
  };

  const [recordTx, token] = await Promise.all([
    service.sendPaymentRecord(record, paymentRecordAccountPubKey),
    ledger.asset.getAsset({ assetId: tokenId }),
    publicKey
      ? service.sendPaymentCancellationReceiptToCustomer(record, publicKey)
      : Promise.resolve(null),
  ]);

  const updatedPayment = await prisma.payment.update({
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

  await sendCancellationMails(payment, observations, token.name);

  return updatedPayment;
}
