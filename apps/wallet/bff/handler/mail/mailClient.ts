// @ts-ignore
import * as Brevo from "@getbrevo/brevo";
interface Mailer {
  name: string;
  email: string;
}
interface SendTransactionMailArgs {
  sender: Mailer;
  replyTo?: Mailer;
  to: Mailer[];
  templateId: number;
  subject: string;
  params?: any;
  tags?: string[];
}

// This is a candidate for @axtp/core, as we will need to send emails from the backoffice also...
export class MailClient {
  private transactionMailApi = new Brevo.TransactionalEmailsApi();

  constructor(apiKey: string) {
    Brevo.ApiClient.instance.authentications["api-key"].apiKey = apiKey;
  }

  public async sendTransactionalEmail(args: SendTransactionMailArgs) {
    const email = new Brevo.SendSmtpEmail();
    email.sender = args.sender;
    email.to = args.to;
    email.replyTo = args.replyTo ?? null;
    email.subject = args.subject;
    email.templateId = args.templateId;
    email.params = args.params ?? null;
    return this.transactionMailApi.sendTransacEmail(email);
  }
}
