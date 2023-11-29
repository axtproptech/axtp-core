import { prisma } from "@axtp/db";
import { notFound, badRequest } from "@hapi/boom";
import { mailService } from "@/bff/services/backofficeMailService";
import { createLedgerClient } from "@/bff/createLedgerClient";

async function sendConfirmationMails(payment: any, tokenName: string) {
  try {
    await Promise.all([
      mailService.internal.sendPaymentConfirmation({
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
      mailService.external.sendPaymentConfirmation({
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

export async function registerTransactionId(id: any, body: any) {
  const { transactionId, status } = body;

  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      customer: {
        include: {
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

  if (payment.customer.blockchainAccounts.length === 0) {
    throw badRequest(
      `Customer [${payment.customer.cuid}] has no blockchain account yet`
    );
  }
  const ledger = createLedgerClient();
  const [updatedPayment, token] = await Promise.all([
    prisma.payment.update({
      where: { id },
      data: {
        status,
        transactionId,
      },
      include: {
        customer: {
          select: {
            cuid: true,
          },
        },
      },
    }),
    ledger.asset.getAsset({ assetId: payment.tokenId }),
  ]);

  await sendConfirmationMails(payment, token.name);

  return updatedPayment;
}
