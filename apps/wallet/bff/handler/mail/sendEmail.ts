import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../handleError";
import { getEnvVar } from "@/bff/getEnvVar";
import { emails_templates } from "./emailTemplates";
import { prisma } from "@axtp/db";
import { createTokenDatabase } from "./generateToken";

const brevo = require("@getbrevo/brevo");

let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = getEnvVar("NEXT_SERVER_BREVO_API_KEY");

const ERROR_MESSAGE_RATE_LIMIT = "Rate Limit of 5 minutes exceeded";
const ERROR_MESSAGE_FIELDS = "Missing required fields";

// define the model of request body
export type SendEmailBody = {
  email: string;
  templateId: number;
  name: string;
  params?: any;
  subject?: string;
};

export const sendEmail: RouteHandlerFunction = async (req, res) => {
  try {
    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    const dataExist = await prisma.emailVerificationTemp.findUnique({
      where: { email: req.body.email },
    });

    //compare if updatedAt is less than 5 minutes
    if (dataExist!.updatedAt > new Date(Date.now() - 5 * 60 * 1000)) {
      res.status(403).json({ message: ERROR_MESSAGE_RATE_LIMIT });
      return;
    }

    sendSmtpEmail = hydrateEmailParams(
      sendSmtpEmail,
      req.body as SendEmailBody
    );

    let result = await apiInstance.sendTransacEmail(sendSmtpEmail);

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
  sendSmtpEmail.templateId =
    emails_templates[templateId as keyof typeof emails_templates];

  switch (templateId) {
    case emails_templates.INVITATION:
    case emails_templates.RESET_PASSWORD:
    case emails_templates.CHANGE_PASSWORD:
    case emails_templates.PASSWORD_CHANGED:
      sendSmtpEmail.params = { ...params, token: createTokenDatabase(email) };
      break;
  }
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.params = params || null;

  return sendSmtpEmail;
};
