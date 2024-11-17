// @ts-ignore
import * as Brevo from "@getbrevo/brevo";
import { BrevoError } from "../errors";

export class MailServiceError extends BrevoError {}

export interface Mailer {
  name: string;
  email: string;
}

export interface MailAttachment {
  absoluteUrl?: string;
  // when using base64, name is required also
  base64?: string;
  name?: string;
}

export interface SendTransactionMailArgs {
  sender: Mailer;
  replyTo?: Mailer;
  to: Mailer[];
  /**
   * The template Id of the email template created in https://app.brevo.com.
   */
  templateId: number;
  subject?: string;
  params?: any;
  tags?: string[];
  attachments?: MailAttachment[];
}

/**
 * Service to send emails
 * @param apiKey The API Key from Brevo
 * @note: This implementation uses https://brevo.com platform as mail sender
 */
export class MailService {
  private transactionMailApi = new Brevo.TransactionalEmailsApi();

  constructor(apiKey: string) {
    Brevo.ApiClient.instance.authentications["api-key"].apiKey = apiKey;
  }

  /**
   * Sends a transactional email
   * @param args The arguments
   */
  public async sendTransactionalEmail(args: SendTransactionMailArgs) {
    try {
      const email = new Brevo.SendSmtpEmail();
      email.sender = args.sender;
      email.to = args.to;
      email.replyTo = args.replyTo ?? null;
      email.subject = args.subject ?? null;
      email.templateId = args.templateId;
      email.params = args.params ?? null;
      email.tags = args.tags ?? [];
      email.attachment = args.attachments ?? undefined;
      await this.transactionMailApi.sendTransacEmail(email);
    } catch (e: any) {
      throw new MailServiceError(e);
    }
  }
}
