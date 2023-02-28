import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";
import { mixed, object, string, ValidationError } from "yup";
import { asPaymentResponse } from "@/bff/handler/payments/asPaymentResponse";
import { createLedgerClient } from "@/bff/createLedgerClient";
import { getEnvVar } from "@/bff/getEnvVar";
import { PaymentRecord, PaymentRecordService, PaymentType } from "@axtp/core";
import { Amount } from "@signumjs/util";

const paymentRequestSchema = object({ txid: string() });

const paymentUpdateBodySchema = object({
  status: mixed().required().oneOf(["Processed", "Cancelled"]),
  transactionId: string().required(),
  observations: string(),
});

export const updatePayment: ApiHandler = async ({ req, res }) => {
  try {
    const { txid } = paymentRequestSchema.validateSync(req.query);
    const { transactionId, status, observations } =
      paymentUpdateBodySchema.validateSync(req.body);

    let payment;
    if (status === "Processed") {
      payment = await prisma.payment.update({
        where: { transactionId: txid },
        data: {
          status,
          processedRecordId: transactionId, // this is the signum txid for the contract call
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

      if (!payment) {
        throw notFound(`Payment ${txid} not found`);
      }
    }

    if (status === "Cancelled") {
      const ledger = createLedgerClient();

      const senderSeed = getEnvVar(
        "NEXT_SERVER_PRINCIPAL_SIGNUM_ACCOUNT_SECRET"
      );
      const paymentRecordAccountPubKey = getEnvVar(
        "NEXT_SERVER_PAYMENT_SIGNUM_ACCOUNT_PUBKEY"
      );
      const sendFeeSigna = parseFloat(getEnvVar("NEXT_SERVER_SIGNUM_SEND_FEE"));

      const service = new PaymentRecordService({
        ledger,
        senderSeed,
        sendFee: Amount.fromSigna(sendFeeSigna),
      });
      payment = await prisma.payment.findUnique({
        where: {
          transactionId: txid,
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
        throw notFound(`Payment ${txid} not found`);
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

      payment = await prisma.payment.update({
        where: { transactionId: txid },
        data: {
          status,
          cancelTransactionId: transactionId, // this is the reimbursement payment id, i.e. pix, usdeth, etc.
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
    } // end update

    res.status(200).json(asPaymentResponse(payment));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
