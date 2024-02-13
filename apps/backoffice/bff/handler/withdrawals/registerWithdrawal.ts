import { createLedgerClient } from "@/bff/createLedgerClient";
import {
  WithdrawalRecord,
  WithdrawalRecordService,
} from "@axtp/core/withdrawalRecord";
import { Amount } from "@signumjs/util";
import { getEnvVar } from "@/bff/getEnvVar";
import { Address } from "@signumjs/core";
import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest, notAcceptable, notFound } from "@hapi/boom";
import { mixed, number, object, string, ValidationError } from "yup";

async function sendRegistrationMails(payment: any, tokenName: string) {
  try {
    // await Promise.all([
    //   mailService.internal.sendPaymentRegistration({
    //     params: {
    //       firstName: payment.customer.firstName,
    //       lastName: payment.customer.lastName,
    //       email: payment.customer.email1,
    //       phone: payment.customer.phone1,
    //       amount: payment.amount.toString(),
    //       currency: payment.currency || "",
    //       paymentId: payment.id.toString(),
    //       tokenQuantity: payment.tokenQuantity.toString(),
    //       tokenName,
    //     },
    //   }),
    //   mailService.external.sendPaymentRegistration({
    //     to: {
    //       firstName: payment.customer.firstName,
    //       lastName: payment.customer.lastName,
    //       email1: payment.customer.email1,
    //     },
    //     params: {
    //       firstName: payment.customer.firstName,
    //       lastName: payment.customer.lastName,
    //       poolId: payment.poolId,
    //       tokenName,
    //       tokenQnt: payment.tokenQuantity.toString(),
    //     },
    //   }),
    // ]);
  } catch (e) {
    console.error("Sending mails failed", e);
  }
}

const registerWithdrawalBodySchema = object({
  customerId: string().required(),
  accountPk: string().required(),
  tokenId: string().required(),
  tokenQnt: number().required(),
  tokenName: string().required(),
  amount: number().required(),
  paymentType: string().required(),
  txId: string().required(),
  usd: number().required(),
  currency: mixed().required().oneOf(["brl", "usd"]),
});

export const registerWithdrawal: ApiHandler = async ({ req, res }) => {
  try {
    const {
      customerId,
      accountPk,
      tokenId,
      tokenQnt,
      tokenName,
      usd,
      amount,
      paymentType,
      currency,
      txId,
    } = registerWithdrawalBodySchema.validateSync(req.body);

    const customer = await prisma.customer.findUnique({
      where: {
        cuid: customerId,
      },
      include: {
        blockchainAccounts: true,
      },
    });

    if (!customer) {
      throw notFound();
    }

    if (!customer.isActive) {
      throw notAcceptable(`Customer is not active`);
    }

    if (customer.isBlocked) {
      throw notAcceptable(`Customer is blocked`);
    }

    const customerPk =
      customer.blockchainAccounts && customer.blockchainAccounts.length
        ? customer.blockchainAccounts[0].publicKey
        : "";
    if (customerPk !== accountPk) {
      throw notAcceptable("Public Key mismatch");
    }

    const ledger = createLedgerClient();
    const senderSeed = getEnvVar("NEXT_SERVER_PRINCIPAL_SIGNUM_ACCOUNT_SECRET");
    const withdrawalRecordAccountPubKey = getEnvVar(
      "NEXT_SERVER_WITHDRAWAL_SIGNUM_ACCOUNT_PUBKEY"
    );
    const sendFeeSigna = parseFloat(getEnvVar("NEXT_SERVER_SIGNUM_SEND_FEE"));

    const service = new WithdrawalRecordService({
      ledger,
      senderSeed,
      sendFee: Amount.fromSigna(sendFeeSigna),
    });

    const record: WithdrawalRecord = {
      accountId: Address.fromPublicKey(accountPk).getNumericId(),
      tokenId,
      tokenName,
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
      service.sendPaymentRecord(record, withdrawalRecordAccountPubKey),
      service.sendWithdrawalReceiptToCustomer(record, accountPk),
    ]);

    // TODO: send emails
    // await sendRegistrationMails(createdPayment, tokenName);
    res.status(201).json(recordTx);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
