import { Mail } from "./types";
import { Mailer, MailService } from "@axtp/core/mailer";

// Brevo IDs
export enum ExternalEmailTemplates {
  ExclusiveAreaInvitation = 6,
  SuccessfulVerification = 7,
  PaymentRegistration = 10,
  PaymentCancellation = 13,
  PaymentConfirmation = 14,
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

  async sendPaymentCancellation(args: SendExternalPaymentArgs) {
    return this.sendExternalMail({
      mail: args,
      templateId: ExternalEmailTemplates.PaymentCancellation,
      tags: ["PaymentCancellation"],
    });
  }
}
