import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../handleError";
import { getEnvVar } from "@/bff/getEnvVar";
import { EmailTemplates } from "./emailTemplates";
import { prisma } from "@axtp/db";
import { generateAndStoreEmailVerificationToken } from "./generateToken";

const brevo = require("@getbrevo/brevo");

let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = getEnvVar("NEXT_SERVER_BREVO_API_KEY");

const RATE_LIMIT_TIME_MINUTES = Number(
  getEnvVar("NEXT_SERVER_RATE_LIMIT_TIME_MINUTES")
);
const ERROR_MESSAGE_RATE_LIMIT = `Rate Limit of ${getEnvVar(
  "NEXT_SERVER_RATE_LIMIT_TIME_MINUTES"
)} minutes exceeded`;
const ERROR_MESSAGE_FIELDS = "Missing required fields";

// define the model of request body
export type SendEmailBody = {
  email: string;
  templateId: EmailTemplates;
  name: string;
  params?: any;
  subject?: string;
};

export const sendEmail: RouteHandlerFunction = async (req, res) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    const dataExist = await prisma.emailVerificationTemp.findUnique({
      where: { email: req.body.email },
    });

    //compare if updatedAt is less than 5 minutes
    if (
      dataExist!.updatedAt >
      new Date(Date.now() - RATE_LIMIT_TIME_MINUTES * 60 * 1000)
    ) {
      res.status(429).json({ message: ERROR_MESSAGE_RATE_LIMIT });
      return;
    }

    sendSmtpEmail = hydrateEmailParams(
      sendSmtpEmail,
      req.body as SendEmailBody
    );

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json(result);
  } catch (e: any) {
    handleError({ e, res });
  }
};

const hydrateEmailParams = (sendSmtpEmail: any, body: any) => {
  const { email, templateId, name, params, subject } = body;

  if (!email || !templateId || !name) {
    throw new Error(ERROR_MESSAGE_FIELDS);
  }

  const sender = {
    name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
    email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
  };

  sendSmtpEmail.sender = sender;
  sendSmtpEmail.replyTo = sender;
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.templateId = EmailTemplates[templateId];

  switch (templateId) {
    case EmailTemplates.INVITATION:
    case EmailTemplates.RESET_PASSWORD:
    case EmailTemplates.CHANGE_PASSWORD:
    case EmailTemplates.PASSWORD_CHANGED:
      sendSmtpEmail.params = {
        ...params,
        token: generateAndStoreEmailVerificationToken(email),
      };
      break;
  }
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.params = params || null;

  return sendSmtpEmail;
};
