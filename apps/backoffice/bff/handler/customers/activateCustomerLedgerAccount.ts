import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { notFound, badData } from "@hapi/boom";
import { object, string } from "yup";

import { createLedgerClient } from "../../createLedgerClient";
import { getEnvVar } from "@/bff/getEnvVar";
import { generateMasterKeys } from "@signumjs/crypto";
import { AttachmentMessage } from "@signumjs/core";
import { Amount } from "@signumjs/util";

const documentQuerySchema = object({
  cuid: string().required(),
});

export const activateCustomerLedgerAccount: ApiHandler = async ({
  req,
  res,
}) => {
  const { cuid } = documentQuerySchema.validateSync(req.query);

  const customer = await prisma.customer.findUnique({
    where: {
      cuid,
    },
    select: {
      blockchainAccounts: {
        select: {
          accountId: true,
          publicKey: true,
        },
      },
    },
  });

  if (!customer) {
    throw notFound();
  }

  if (!customer.blockchainAccounts.length) {
    throw badData(
      `No blockchain account found in database for customer "${cuid}"`
    );
  }
  const { accountId, publicKey } = customer.blockchainAccounts![0];
  const ledger = createLedgerClient();
  try {
    const account = await ledger.account.getAccount({ accountId });
    if (account.publicKey) {
      // if exists pubkey then the account is active
      return;
    }
  } catch (err) {
    // expects to throw if not found!
  }

  const keys = generateMasterKeys(
    getEnvVar("NEXT_SERVER_PRINCIPAL_SIGNUM_ACCOUNT_SECRET")
  );

  const welcomeMessageAttachment = new AttachmentMessage({
    message:
      "Bem-vindo ao mundo do web3 da AXT PropTech S/A. Se você está lendo esta mensagem, sua conta no ledger foi ativada com sucesso e você foi verificado com sucesso pela AXT. Agora, você pode adquirir seus ativos digitais para participar de uma nova forma de renda passiva.",
    messageIsText: true,
  });

  await ledger.transaction.sendAmountToSingleRecipient({
    attachment: welcomeMessageAttachment,
    amountPlanck: Amount.fromSigna(5).getPlanck(),
    feePlanck: Amount.fromSigna(0.03).getPlanck(),
    recipientId: accountId,
    recipientPublicKey: publicKey,
    senderPublicKey: keys.publicKey,
    senderPrivateKey: keys.signPrivateKey,
  });
};
