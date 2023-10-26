import { Customer } from "@axtp/db";
import { MailClient } from "@/bff/mailClient";
import { getEnvVar } from "@/bff/getEnvVar";
import { EmailTemplates } from "@/bff/types/emailTemplates";
import { bffLoggingService } from "@/bff/bffLoggingService";

async function sendRegistrationMailToCustomer(
  newCustomer: Customer,
  mailClient: MailClient
) {
  try {
    await mailClient.sendTransactionalEmail({
      sender: {
        name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
        email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
      },
      to: [
        {
          name: `${newCustomer.firstName} ${newCustomer.lastName}`,
          email: newCustomer.email1,
        },
      ],
      templateId: EmailTemplates.SuccessfulRegistration,
      tags: ["SuccessfulRegistration"],
      params: {
        firstName: newCustomer.firstName,
      },
    });
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error sending registration mail to customer: " + e.message,
      domain: "customer",
      detail: { email: newCustomer.email1, cuid: newCustomer.cuid },
    });
  }
}

async function sendRegistrationMailToAXT(
  newCustomer: Customer,
  mailClient: MailClient
) {
  try {
    await mailClient.sendTransactionalEmail({
      sender: {
        name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
        email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
      },
      to: [
        {
          name: "[AXT Notification] KYC Registration",
          email: getEnvVar("NEXT_SERVER_AXT_KYC_MAIL_ADDRESS"),
        },
      ],
      templateId: EmailTemplates.InternalNewRegistration,
      tags: ["InternalNewRegistration"],
      params: {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email1,
        phone: newCustomer.phone1,
        cpf: newCustomer.cpfCnpj,
        cuid: newCustomer.cuid,
      },
    });
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error sending internal notification mail: " + e.message,
      domain: "customer",
      detail: { email: newCustomer.email1, cuid: newCustomer.cuid },
    });
  }
}

export async function sendSuccessfulRegistrationMails(newCustomer: Customer) {
  bffLoggingService.info({
    msg: "Sending Registration Emails for Customer",
    domain: "customer",
    detail: { cpfCnpj: newCustomer.cpfCnpj, cuid: newCustomer.cuid },
  });

  const mailClient = new MailClient(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
  await Promise.all([
    sendRegistrationMailToCustomer(newCustomer, mailClient),
    sendRegistrationMailToAXT(newCustomer, mailClient),
  ]);
}
