import { prisma } from "@axtp/db";
import { badRequest, notFound } from "@hapi/boom";
import { createLedgerClient } from "@/bff/createLedgerClient";
import { mailService } from "@/bff/services/backofficeMailService";

async function sendProcessingMails(
  payment: any,
  txId: string,
  tokenName: string
) {
  try {
    await Promise.all([
      mailService.internal.sendPaymentProcessing({
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
      mailService.external.sendPaymentProcessing({
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
          txId,
        },
      }),
    ]);
  } catch (e) {
    console.error("Sending mails failed", e);
  }
}
export async function processPayment(id: any, body: any) {
  const { transactionId: reference, status, observations } = body;

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

  if (payment.processedRecordId) {
    throw badRequest(`Payment [${id}] was already processed`);
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
        processedRecordId: reference, // this is the signum txid for the contract call
        observations,
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

  await sendProcessingMails(payment, reference, token.name);

  return updatedPayment;
}
