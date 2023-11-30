import { createLedgerClient } from "@/bff/createLedgerClient";
import { PaymentRecordService, PaymentRecord } from "@axtp/core";
import { Amount } from "@signumjs/util";
import { getEnvVar } from "@/bff/getEnvVar";
import { Address } from "@signumjs/core";
import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";
import { mixed, number, object, string, ValidationError } from "yup";
import { mailService } from "@/bff/services/backofficeMailService";

async function sendRegistrationMails(payment: any, tokenName: string) {
  try {
    await Promise.all([
      mailService.internal.sendPaymentRegistration({
        params: {
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
      mailService.external.sendPaymentRegistration({
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
        },
      }),
    ]);
  } catch (e) {
    console.error("Sending mails failed", e);
  }
}

const registerPaymentBodySchema = object({
  customerId: string().required(),
  accountPk: string().required(),
  poolId: string().required(),
  tokenId: string().required(),
  tokenQnt: number().required(),
  tokenName: string().required(),
  amount: number().required(),
  paymentType: string().required(),
  txId: string().required(),
  usd: number().required(),
  currency: mixed().required().oneOf(["brl", "usd"]),
});

export const registerPayment: ApiHandler = async ({ req, res }) => {
  try {
    const {
      customerId,
      accountPk,
      poolId,
      tokenId,
      tokenQnt,
      tokenName,
      usd,
      amount,
      paymentType,
      currency,
      txId,
    } = registerPaymentBodySchema.validateSync(req.body);

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
      tokenQuantity: tokenQnt.toString(),
      paymentUsd: usd.toString(),
      paymentAmount: amount.toString(),
      paymentCurrency: currency,
      paymentTransactionId: txId,
      // @ts-ignore
      paymentType,
      customerId,
    };

    const [recordTx] = await Promise.all([
      service.sendPaymentRecord(record, paymentRecordAccountPubKey),
      service.sendPaymentReceiptToCustomer(record, accountPk),
    ]);

    const createdPayment = await prisma.payment.create({
      data: {
        tokenId,
        tokenQuantity: tokenQnt,
        poolId,
        accountId: record.accountId,
        amount,
        status: "Pending",
        type: paymentType,
        transactionId: txId,
        recordId: recordTx.transaction,
        usd,
        currency: currency.toUpperCase(),
        customer: {
          connect: {
            cuid: customerId,
          },
        },
      },
      include: {
        customer: true,
      },
    });

    await sendRegistrationMails(createdPayment, tokenName);
    res.status(201).json(recordTx);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
