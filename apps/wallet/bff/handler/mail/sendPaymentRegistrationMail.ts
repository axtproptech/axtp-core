import { MailService } from "@axtp/core/mailer";
import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../handleError";
import { getEnvVar } from "@/bff/getEnvVar";
import { number, object, string } from "yup";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { EmailTemplates } from "@/bff/types/emailTemplates";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";

const SendPaymentRegistrationMailBody = object({
  cuid: string().required(),
  txId: string().required(),
  tokenQnt: number().required(),
  tokenName: string().required(),
  poolId: string().required(),
});

export const sendPaymentRegistrationMail: RouteHandlerFunction = async (
  req,
  res
) => {
  try {
    const { cuid, txId, tokenQnt, tokenName, poolId } =
      SendPaymentRegistrationMailBody.validateSync(req.body);

    const customer = await prisma.customer.findUnique({
      where: {
        cuid,
      },
    });

    if (!customer) {
      throw notFound();
    }

    const mailService = new MailService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
    await mailService.sendTransactionalEmail({
      sender: {
        name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
        email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
      },
      to: [
        {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email1,
        },
      ],
      templateId: EmailTemplates.PaymentRegistration,
      tags: ["PaymentRegistration"],
      params: {
        txId,
        name: customer.firstName,
        tokenQnt,
        tokenName,
        poolId,
      },
    });

    // TODO: send internal email

    bffLoggingService.info({
      msg: `Payment Registration sent to ${customer.email1}`,
      domain: "mail",
    });
    res.status(204).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};
