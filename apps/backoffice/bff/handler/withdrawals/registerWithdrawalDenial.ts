import { createLedgerClient } from "@/bff/createLedgerClient";
import { WithdrawalLedgerRecordService } from "@axtp/core/withdrawalRecord";
import { Amount, ChainValue } from "@signumjs/util";
import { getEnvVar } from "@/bff/getEnvVar";
import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest, notAcceptable, notFound } from "@hapi/boom";
import { number, object, string, ValidationError } from "yup";
import { mailService } from "@/bff/services/backofficeMailService";

interface DenialMailArgs {
  tokenName: string;
  tokenQuantity: number;
  tokenDecimals: number;
  reason: string;
  customer: any;
}

async function sendWithdrawalDeniedMails(denial: DenialMailArgs) {
  try {
    const { customer } = denial;
    const tokenAmount = ChainValue.create(denial.tokenDecimals)
      .setAtomic(denial.tokenQuantity)
      .getCompound();
    await Promise.all([
      mailService.internal.sendWithdrawalCancellation({
        params: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email1,
          phone: customer.phone1,
          tokenQuantity: tokenAmount,
          tokenName: denial.tokenName,
          reason: denial.reason,
        },
      }),
      mailService.external.sendWithdrawalCancellation({
        to: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email1: customer.email1,
        },
        params: {
          firstName: customer.firstName,
          reason: denial.reason,
          tokenName: denial.tokenName,
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
  reason: string().required().min(16).max(256),
});

export const registerWithdrawalDenial: ApiHandler = async ({ req, res }) => {
  try {
    const {
      customerId,
      accountPk,
      tokenId,
      tokenQnt,
      tokenName,
      tokenDecimals,
      reason,
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
    const sendFeeSigna = parseFloat(getEnvVar("NEXT_SERVER_SIGNUM_SEND_FEE"));

    const service = new WithdrawalLedgerRecordService({
      ledger,
      senderSeed,
      sendFee: Amount.fromSigna(sendFeeSigna),
    });
    await Promise.all([
      service.sendWithdrawalDenialToCustomer(
        tokenQnt.toString(),
        tokenId,
        reason,
        accountPk
      ),
      sendWithdrawalDeniedMails({
        reason,
        tokenDecimals,
        tokenQuantity: tokenQnt,
        tokenName,
        customer,
      }),
    ]);
    res.status(204).end();
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
