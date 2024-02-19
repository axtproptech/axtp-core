import { MailService } from "@axtp/core/mailer";
import { getEnvVar } from "@/bff/getEnvVar";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { EmailTemplates } from "@/bff/types/emailTemplates";
import { Customer, prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { RequestWithdrawalRequest } from "@/bff/types/requestWithdrawalRequest";

const Sender = {
  name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
  email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
};

async function sendInternalWithdrawalRequestMail(
  customer: Customer,
  request: RequestWithdrawalRequest,
  mailService: MailService
) {
  try {
    await mailService.sendTransactionalEmail({
      sender: Sender,
      to: [
        {
          name: "[AXT Notification] Withdrawal Requested",
          email: getEnvVar("NEXT_SERVER_AXT_FINANCIAL_MAIL_ADDRESS"),
        },
      ],
      templateId: EmailTemplates.InternalWithdrawalRequest,
      tags: ["InternalWithdrawalRequest"],
      params: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email1,
        phone: customer.phone1,
        tokenName: request.tokenName,
        tokenQuantity: request.tokenQnt,
        currency: request.currency,
      },
    });

    bffLoggingService.info({
      msg: "Internal Withdrawal Request Notification sent to AXT",
      domain: "mail",
    });
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error sending Internal Withdrawal Request mail: " + e.message,
      domain: "withdrawal",
      detail: {
        txId: request.txId,
        tokenName: request.tokenName,
        tokenQnt: request.tokenQnt,
        email: customer.email1,
        cuid: customer.cuid,
      },
    });
  }
}

async function sendCustomerWithdrawalRequestMail(
  customer: Customer,
  request: RequestWithdrawalRequest,
  mailService: MailService
) {
  try {
    await mailService.sendTransactionalEmail({
      sender: Sender,
      to: [
        {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email1,
        },
      ],
      templateId: EmailTemplates.WithdrawalRequest,
      tags: ["WithdrawalRequest"],
      params: {
        firstName: customer.firstName,
        tokenQnt: request.tokenQnt,
        tokenName: request.tokenName,
      },
    });

    bffLoggingService.info({
      msg: `Withdrawal Request Confirmation sent to ${customer.email1}`,
      domain: "mail",
    });
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error sending Withdrawal Request Confirmation mail: " + e.message,
      domain: "withdrawal",
      detail: {
        txId: request.txId,
        tokenName: request.tokenName,
        tokenQnt: request.tokenQnt,
        email: customer.email1,
        cuid: customer.cuid,
      },
    });
  }
}

export async function sendWithdrawalRequestMails(
  withdrawalRequest: RequestWithdrawalRequest
) {
  const { customerId } = withdrawalRequest;

  const customer = await prisma.customer.findUnique({
    where: {
      cuid: customerId,
    },
  });

  if (!customer) {
    throw notFound();
  }

  const mailService = new MailService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
  await Promise.all([
    sendCustomerWithdrawalRequestMail(customer, withdrawalRequest, mailService),
    sendInternalWithdrawalRequestMail(customer, withdrawalRequest, mailService),
  ]);
}
