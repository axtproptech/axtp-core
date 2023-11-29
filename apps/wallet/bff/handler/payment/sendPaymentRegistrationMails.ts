import { MailService } from "@axtp/core/mailer";
import { getEnvVar } from "@/bff/getEnvVar";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { EmailTemplates } from "@/bff/types/emailTemplates";
import { Customer, prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { TransactionId } from "@signumjs/core";

type RecordPaymentTx = RegisterPaymentRequest & { recordTx: TransactionId };

async function sendInternalPaymentRegistrationMail(
  customer: Customer,
  payment: RecordPaymentTx,
  mailService: MailService
) {
  try {
    await mailService.sendTransactionalEmail({
      sender: {
        name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
        email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
      },
      to: [
        {
          name: "[AXT Notification] Incoming Payment",
          email: getEnvVar("NEXT_SERVER_AXT_FINANCIAL_MAIL_ADDRESS"),
        },
      ],
      templateId: EmailTemplates.InternalPaymentRegistration,
      tags: ["InternalPaymentRegistration"],
      params: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email1,
        phone: customer.phone1,
        tokenName: payment.tokenName,
        tokenQuantity: payment.tokenQnt,
        currency: payment.currency,
        amount: payment.amount,
      },
    });

    bffLoggingService.info({
      msg: "Internal Payment Registration sent to AXT",
      domain: "mail",
    });
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error sending internal payment registration mail: " + e.message,
      domain: "payment",
      detail: {
        txId: payment.txId,
        recordTx: payment.recordTx.transaction,
        poolId: payment.poolId,
        tokenName: payment.tokenName,
        tokenQnt: payment.tokenQnt,
        email: customer.email1,
        cuid: customer.cuid,
      },
    });
  }
}

async function sendCustomerPaymentRegistrationMail(
  customer: Customer,
  payment: RecordPaymentTx,
  mailService: MailService
) {
  try {
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
        recordTx: payment.recordTx.transaction,
        firstName: customer.firstName,
        tokenQnt: payment.tokenQnt,
        tokenName: payment.tokenName,
        poolId: payment.poolId,
      },
    });

    bffLoggingService.info({
      msg: `Payment Registration sent to ${customer.email1}`,
      domain: "mail",
    });
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error sending payment registration mail: " + e.message,
      domain: "payment",
      detail: {
        txId: payment.txId,
        recordTx: payment.recordTx.transaction,
        poolId: payment.poolId,
        tokenName: payment.tokenName,
        tokenQnt: payment.tokenQnt,
        email: customer.email1,
        cuid: customer.cuid,
      },
    });
  }
}

export async function sendPaymentRegistrationMails(payment: RecordPaymentTx) {
  const { customerId } = payment;

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
    sendCustomerPaymentRegistrationMail(customer, payment, mailService),
    sendInternalPaymentRegistrationMail(customer, payment, mailService),
  ]);
}
