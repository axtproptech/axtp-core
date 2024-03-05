import { createLedgerClient } from "@/bff/createLedgerClient";
import {
  WithdrawalRecord,
  WithdrawalLedgerRecordService,
} from "@axtp/core/withdrawalRecord";
import { Amount, ChainValue } from "@signumjs/util";
import { getEnvVar } from "@/bff/getEnvVar";
import { Address } from "@signumjs/core";
import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest, notAcceptable, notFound } from "@hapi/boom";
import { mixed, number, object, string, ValidationError } from "yup";
import { mailService } from "@/bff/services/backofficeMailService";

async function sendWithdrawalProcessedMails(
  withdrawal: WithdrawalRecord,
  customer: any
) {
  try {
    const tokenAmount = ChainValue.create(withdrawal.tokenDecimals)
      .setAtomic(withdrawal.tokenQuantity)
      .getCompound();
    await Promise.all([
      mailService.internal.sendWithdrawalProcessed({
        params: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email1,
          phone: customer.phone1,
          amount: withdrawal.paymentAmount,
          currency: withdrawal.paymentCurrency.toUpperCase() || "",
          tokenQuantity: tokenAmount,
          tokenName: withdrawal.tokenName,
        },
      }),
      mailService.external.sendWithdrawalProcessed({
        to: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email1: customer.email1,
        },
        params: {
          firstName: customer.firstName,
          amount: withdrawal.paymentAmount,
          currency: withdrawal.paymentCurrency.toUpperCase(),
          tokenName: withdrawal.tokenName,
          tokenQnt: tokenAmount,
        },
      }),
    ]);
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
  tokenDecimals: number().required(),
  amount: number().required(),
  paymentType: string().required(),
  txId: string().required(),
  usd: number().required(),
  currency: mixed().required().oneOf(["brl", "usd"]),
});

export const registerWithdrawalConfirmation: ApiHandler = async ({
  req,
  res,
}) => {
  try {
    const {
      customerId,
      accountPk,
      tokenId,
      tokenQnt,
      tokenName,
      tokenDecimals,
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

    const service = new WithdrawalLedgerRecordService({
      ledger,
      senderSeed,
      sendFee: Amount.fromSigna(sendFeeSigna),
    });

    const record: WithdrawalRecord = {
      accountId: Address.fromPublicKey(accountPk).getNumericId(),
      tokenId,
      tokenName,
      tokenDecimals,
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
      service.sendWithdrawalConfirmationRecord(
        record,
        withdrawalRecordAccountPubKey
      ),
      service.sendWithdrawalReceiptToCustomer(record, accountPk),
    ]);

    // send once is all fine
    await sendWithdrawalProcessedMails(record, customer);
    res.status(201).json(recordTx);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
