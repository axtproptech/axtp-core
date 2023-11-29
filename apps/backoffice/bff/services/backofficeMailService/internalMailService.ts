import { getEnvVar } from "@/bff/getEnvVar";
import { Mailer, MailService } from "@axtp/core/mailer";
import { Customer } from "@axtp/db";
import { Mail } from "./types";

const IsStaging = getEnvVar("NEXT_PUBLIC_SIGNUM_IS_TESTNET") === "true";
interface InternalMailArgs<T> extends Omit<Mail<T>, "to"> {}

// Brevo IDs
enum InternalEmailTemplates {
  CustomerUpdated = 8,
  PaymentRegistration = 9,
  PaymentConfirmation = 11,
  PaymentCancellation = 12,
  PaymentProcessing = 16,
}
interface SendInternalCustomerUpdateArgs
  extends InternalMailArgs<{
    customer: Customer;
  }> {}
interface SendInternalPaymentMailArgs
  extends InternalMailArgs<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    paymentId: string;
    tokenName: string;
    tokenQuantity: string;
    amount: string;
    currency: string;
    reason?: string;
  }> {}
export class InternalMailService {
  private readonly recipientFinancial: string;
  private readonly recipientKyc: string;

  constructor(private service: MailService, private sender: Mailer) {
    this.recipientFinancial = getEnvVar(
      "NEXT_SERVER_AXT_FINANCIAL_MAIL_ADDRESS"
    );
    this.recipientKyc = getEnvVar("NEXT_SERVER_AXT_KYC_MAIL_ADDRESS");
  }
  private async sendInternalMail<T = any>({
    mail,
    tags,
    action,
    toEmail,
    templateId,
  }: {
    mail: InternalMailArgs<T>;
    action: string;
    toEmail: string;
    tags: string[];
    templateId: InternalEmailTemplates;
  }) {
    try {
      await this.service.sendTransactionalEmail({
        sender: this.sender,
        to: [
          {
            name: `[AXT Notification] ${action}`,
            email: toEmail,
          },
        ],
        templateId,
        tags,
        params: mail.params,
      });
    } catch (e: any) {
      console.error("Mailer failed", e);
      throw e;
    }
  }

  private async sendInternalUserUpdateMail({
    mail,
    action,
  }: {
    mail: SendInternalCustomerUpdateArgs;
    action: string;
  }) {
    return this.sendInternalMail({
      mail: {
        params: {
          action: `${IsStaging ? "[STAGE] " : ""}${action}`,
          firstName: mail.params.customer.firstName,
          lastName: mail.params.customer.lastName,
          email: mail.params.customer.email1,
          cuid: mail.params.customer.cuid,
        },
      },
      action,
      toEmail: this.recipientKyc,
      templateId: InternalEmailTemplates.CustomerUpdated,
      tags: ["CustomerUpdate"],
    });
  }

  async sendCustomerUpdated({
    action,
    customer,
  }: {
    action: string;
    customer: Customer;
  }) {
    return this.sendInternalUserUpdateMail({
      action,
      mail: {
        params: {
          customer,
        },
      },
    });
  }

  async sendPaymentRegistration(args: SendInternalPaymentMailArgs) {
    return this.sendInternalMail({
      mail: args,
      action: "Payment Registration",
      toEmail: this.recipientFinancial,
      templateId: InternalEmailTemplates.PaymentRegistration,
      tags: ["PaymentRegistration"],
    });
  }

  async sendPaymentProcessing(args: SendInternalPaymentMailArgs) {
    return this.sendInternalMail({
      mail: args,
      action: "Payment Processed (Token Transferred)",
      toEmail: this.recipientFinancial,
      templateId: InternalEmailTemplates.PaymentProcessing,
      tags: ["PaymentProcessing"],
    });
  }

  async sendPaymentConfirmation(args: SendInternalPaymentMailArgs) {
    return this.sendInternalMail({
      mail: args,
      action: "Payment Confirmation",
      toEmail: this.recipientFinancial,
      templateId: InternalEmailTemplates.PaymentConfirmation,
      tags: ["PaymentConfirmation"],
    });
  }

  async sendPaymentCancellation(args: SendInternalPaymentMailArgs) {
    return this.sendInternalMail({
      mail: args,
      action: "Payment Cancellation",
      toEmail: this.recipientFinancial,
      templateId: InternalEmailTemplates.PaymentCancellation,
      tags: ["PaymentCancellation"],
    });
  }
}
