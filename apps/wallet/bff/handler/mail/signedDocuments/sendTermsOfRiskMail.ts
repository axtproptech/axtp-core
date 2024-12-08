import { notFound } from "@hapi/boom";
import { prisma } from "@axtp/db";
import { MailService } from "@axtp/core/mailer";
import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../../handleError";
import { getEnvVar } from "@/bff/getEnvVar";
import { object, string } from "yup";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { EmailTemplates } from "@/bff/types/emailTemplates";

const SendTermsOfRiskMailBody = object({
  cuid: string().required(),
  transactionId: string().required(),
  // TODO: add the document stuff
  // document: object({
  //   content: string().required(),
  //   name: string().required(),
  // }),
});

async function sendInternalTermsOfRiskMail(
  customer: any,
  transactionId: string
) {
  const customerAccount = customer.blockchainAccounts.length
    ? customer.blockchainAccounts![0]
    : null;
  if (!customerAccount) {
    throw notFound(
      `No blockchain account for customer [${customer.customerId}]`
    );
  }
  const mailService = new MailService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
  await mailService.sendTransactionalEmail({
    sender: {
      name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
      email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
    },
    to: [
      {
        name: `[AXT Notification] Document Signed`,
        email: getEnvVar("NEXT_SERVER_AXT_KYC_MAIL_ADDRESS"),
      },
    ],
    templateId: EmailTemplates.InternalDocumentSigned,
    tags: ["DocumentSigning"],
    params: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email1,
      accountAddress: customerAccount.rsAddress,
      transactionId,
      documentType: "Terms Of Risk",
    },
  });
  bffLoggingService.info({
    msg: `Internal Document Signing Confirmation Mail sent`,
    domain: "mail",
  });
}

async function sendTermsOfRiskMailToCustomer(
  customer: any,
  transactionId: string
) {
  const name = `${customer.firstName} ${customer.lastName}`;
  const mailService = new MailService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
  await mailService.sendTransactionalEmail({
    sender: {
      name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
      email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
    },
    to: [
      {
        name,
        email: customer.email1,
      },
    ],
    templateId: EmailTemplates.DocumentSigned,
    tags: ["DocumentSigning"],
    params: {
      firstName: customer.firstName,
      documentType: "Termos de Risco",
      transactionId: transactionId,
    },
    // TODO: attach signed document...
    // attachments: [{
    //   base64: document.content,
    //   name: document.name,
    // }]
  });
  bffLoggingService.info({
    msg: `Document Signing Confirmation Mail sent to ${customer.email1}`,
    domain: "mail",
  });
}

export const sendTermsOfRiskMail: RouteHandlerFunction = async (req, res) => {
  try {
    const { cuid, transactionId } = SendTermsOfRiskMailBody.validateSync(
      req.body
    );

    const customer = await prisma.customer.findUnique({
      where: {
        cuid,
      },
      include: {
        signedDocuments: {
          where: {
            transactionId,
          },
        },
        blockchainAccounts: true,
      },
    });

    if (!customer?.signedDocuments || customer.signedDocuments.length === 0) {
      throw notFound(
        `No document with txId [${transactionId}] found for customer [${cuid}]`
      );
    }
    await Promise.all([
      sendInternalTermsOfRiskMail(customer, transactionId),
      sendTermsOfRiskMailToCustomer(customer, transactionId),
    ]);
    res.status(204).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};
