import { Mail } from "./types";
import { Mailer, MailService } from "@axtp/core/mailer";

// Brevo IDs
export enum ExternalEmailTemplates {
  ExclusiveAreaInvitation = 6,
  SuccessfulVerification = 7,
  PaymentRegistration = 10,
  PaymentCancellation = 13,
  PaymentConfirmation = 14,
  PaymentProcessing = 15,
  WithdrawalProcessed = 22,
  WithdrawalCancellation = 24,
}
interface SendExclusiveAreaInvitationArgs
  extends Mail<{
    firstName: string;
    accessLink: string;
  }> {}

interface SendSuccessfulVerificationArgs
  extends Mail<{
    firstName: string;
  }> {}

interface SendExternalPaymentArgs
  extends Mail<{
    firstName: string;
    lastName: string;
    tokenQnt: string;
    tokenName: string;
    poolId: string;
    reason?: string;
    txId?: string;
  }> {}

interface SendExternalWithdrawalProcessedArgs
  extends Mail<{
    firstName: string;
    tokenQnt: string;
    tokenName: string;
    amount: string;
    currency: string;
  }> {}

interface SendExternalWithdrawalDeniedArgs
  extends Mail<{
    firstName: string;
    tokenQnt: string;
    tokenName: string;
    reason: string;
  }> {}

export class ExternalMailService {
  constructor(private service: MailService, private sender: Mailer) {}

  private async sendExternalMail<T = any>({
    mail,
    tags,
    templateId,
  }: {
    mail: Mail<T>;
    tags: string[];
    templateId: ExternalEmailTemplates;
  }) {
    try {
      await this.service.sendTransactionalEmail({
        sender: this.sender,
        to: [
          {
            name: `${mail.to.firstName} ${mail.to.lastName}`,
            email: mail.to.email1,
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

  async sendExclusiveAreaInvitation(args: SendExclusiveAreaInvitationArgs) {
    return this.sendExternalMail({
      mail: args,
      tags: ["ExclusiveArea"],
      templateId: ExternalEmailTemplates.ExclusiveAreaInvitation,
    });
  }

  async sendSuccessfulVerification(args: SendSuccessfulVerificationArgs) {
    return this.sendExternalMail({
      mail: args,
      tags: ["Verification"],
      templateId: ExternalEmailTemplates.SuccessfulVerification,
    });
  }

  async sendPaymentRegistration(args: SendExternalPaymentArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.PaymentRegistration,
      tags: ["PaymentRegistration"],
    });
  }

  async sendPaymentConfirmation(args: SendExternalPaymentArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.PaymentConfirmation,
      tags: ["PaymentConfirmation"],
    });
  }
  async sendPaymentProcessing(args: SendExternalPaymentArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.PaymentProcessing,
      tags: ["PaymentProcessing"],
    });
  }

  async sendPaymentCancellation(args: SendExternalPaymentArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.PaymentCancellation,
      tags: ["PaymentCancellation"],
    });
  }

  async sendWithdrawalProcessed(args: SendExternalWithdrawalProcessedArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.WithdrawalProcessed,
      tags: ["WithdrawalProcessed"],
    });
  }

  async sendWithdrawalCancellation(args: SendExternalWithdrawalDeniedArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.WithdrawalCancellation,
      tags: ["WithdrawalDenied"],
    });
  }
}
