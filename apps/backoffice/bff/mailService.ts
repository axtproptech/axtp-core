import { Transporter, createTransport } from "nodemailer";
import * as process from "process";
import path from "path";
import * as eta from "eta";

eta.configure({
  views: path.join(process.cwd(), "templates"),
});
interface InvitationParams {
  firstName: string;
}

interface SendAuth0InvitationArgs {
  to: string;
  params: InvitationParams; // tbd
}

// Check how to setup OAuth for gmail
// https://docs.emailengine.app/gmail-oauth-service-accounts
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_SERVER_MAIL_SERVICE_USER,
        pass: process.env.NEXT_SERVER_MAIL_SERVICE_SECRET,
      },
    });
  }

  async sendExclusiveAreaInvitation(args: SendAuth0InvitationArgs) {
    try {
      const html = await eta.renderFile("./test.html", args.params);
      return this.transporter.sendMail({
        from: process.env.NEXT_SERVER_MAIL_SERVICE_SENDER_ADDRESS,
        to: args.to,
        subject: "Test Mail",
        html,
      });
    } catch (e: any) {
      console.error("Mailer failed", e);
      throw e;
    }
  }
}

export const mailService = new MailService();
