import { MailService } from "@axtp/core/mailer";
import { Customer } from "@axtp/db";
import { getEnvVar } from "../../getEnvVar";
import { EmailTemplates, InternalEmailTemplates, Mail } from "./types";

const IsStaging = getEnvVar("NEXT_PUBLIC_SIGNUM_IS_TESTNET") === "true";
const Sender = {
  name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
  email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
};

interface InvitationParams {
  firstName: string;
  accessLink: string;
}

interface SuccessfulVerificationParams {
  firstName: string;
}

interface SendExclusiveAreaInvitationArgs extends Mail<InvitationParams> {}

interface SendSuccessfulVerificationArgs
  extends Mail<SuccessfulVerificationParams> {}

interface GenericInternalParams {
  customer: Customer;
}

interface SendInternalMailArgs<T> extends Omit<Mail<T>, "to"> {}

interface SendInternalCustomerUpdateArgs
  extends SendInternalMailArgs<GenericInternalParams> {}

export class BackofficeMailService {
  private service: MailService;

  constructor() {
    this.service = new MailService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
  }

  private async sendExternalMail<T = any>({
    mail,
    tags,
    templateId,
  }: {
    mail: Mail<T>;
    tags: string[];
    templateId: EmailTemplates;
  }) {
    try {
      await this.service.sendTransactionalEmail({
        sender: Sender,
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

  private async sendInternalMail<T = any>({
    mail,
    tags,
    action,
    toEmail,
    templateId,
  }: {
    mail: SendInternalMailArgs<T>;
    action: string;
    toEmail: string;
    tags: string[];
    templateId: InternalEmailTemplates;
  }) {
    try {
      await this.service.sendTransactionalEmail({
        sender: Sender,
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
      toEmail: getEnvVar("NEXT_SERVER_AXT_KYC_MAIL_ADDRESS"),
      templateId: InternalEmailTemplates.CustomerUpdated,
      tags: ["CustomerUpdate"],
    });
  }

  async sendExclusiveAreaInvitation(args: SendExclusiveAreaInvitationArgs) {
    return this.sendExternalMail({
      mail: args,
      tags: ["ExclusiveArea"],
      templateId: EmailTemplates.ExclusiveAreaInvitation,
    });
  }

  async sendSuccessfulVerification(args: SendSuccessfulVerificationArgs) {
    return this.sendExternalMail({
      mail: args,
      tags: ["Verification"],
      templateId: EmailTemplates.SuccessfulVerification,
    });
  }

  async sendInternalCustomerUpdated({
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
}

export const mailService = new BackofficeMailService();
