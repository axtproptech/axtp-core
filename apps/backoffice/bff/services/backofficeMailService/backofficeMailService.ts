import { Mailer, MailService } from "@axtp/core/mailer";
import { getEnvVar } from "../../getEnvVar";
import { ExternalMailService } from "./externalMailService";
import { InternalMailService } from "./internalMailService";

export class BackofficeMailService {
  private service: MailService;
  private sender: Mailer;
  private internalMailService: InternalMailService;
  private externalMailService: ExternalMailService;

  constructor() {
    this.service = new MailService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
    this.sender = {
      name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
      email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
    };

    this.internalMailService = new InternalMailService(
      this.service,
      this.sender
    );
    this.externalMailService = new ExternalMailService(
      this.service,
      this.sender
    );
  }

  get internal() {
    return this.internalMailService;
  }

  get external() {
    return this.externalMailService;
  }
}

export const mailService = new BackofficeMailService();
