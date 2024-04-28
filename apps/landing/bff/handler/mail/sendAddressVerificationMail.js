import { tooManyRequests, unauthorized } from "@hapi/boom";
import { object, string } from "yup";
import { prisma } from "@axtp/db";
import { MailService, generateRandomHexToken } from "@axtp/core";
import { handleError } from "../handleError";
import { EmailTemplates } from "./emailTemplates";

const Minutes = 60 * 1000;
const Env = {
  RateLimitInMinutes:
    Number(
      process.env.NEXT_SERVER_MAIL_VERIFICATION_RATE_LIMIT_MINUTES || "1"
    ) * Minutes,
  ExpiryMinutes:
    Number(process.env.NEXT_SERVER_MAIL_VERIFICATION_EXPIRY_MINUTES || "15") *
    Minutes,
  MaxRetrials:
    Number(process.env.NEXT_SERVER_MAIL_VERIFICATION_MAX_TRIALS || "5") *
    Minutes,
  Mail: {
    BrevoApiKey: process.env.NEXT_SERVER_BREVO_API_KEY || "",
    SenderName: process.env.NEXT_SERVER_BREVO_SENDER_NAME || "",
    SenderMail: process.env.NEXT_SERVER_BREVO_SENDER_EMAIL || "",
  },
};

const SendAddressVerificationMailBody = object({
  email: string().required(),
  name: string().required(),
});

export const sendAddressVerificationMail = async (req, res) => {
  try {
    const { email, name } = SendAddressVerificationMailBody.validateSync(
      req.body
    );

    const existingToken = await prisma.securityToken.findUnique({
      where: {
        subjectId_purpose: {
          subjectId: email,
          purpose: "EmailVerification",
        },
      },
    });

    if (existingToken && existingToken.status === "Blocked") {
      throw unauthorized(`Blocked`);
    }

    const rateLimitWindow = Env.RateLimitInMinutes;
    if (
      existingToken &&
      existingToken.updatedAt.getTime() > Date.now() - rateLimitWindow
    ) {
      throw tooManyRequests("Too many requests");
    }

    const { token } = await upsertVerificationToken(email, existingToken);
    const mailService = new MailService(Env.Mail.BrevoApiKey);
    await mailService.sendTransactionalEmail({
      sender: {
        name: Env.Mail.SenderName,
        email: Env.Mail.SenderMail,
      },
      to: [
        {
          name,
          email,
        },
      ],
      templateId: EmailTemplates.AddressVerification,
      tags: ["EmailVerification"],
      params: {
        token,
        name,
      },
    });
    console.info(`Verification Mail sent to ${email}`);
    res.status(204).end();
  } catch (e) {
    handleError({ e, res });
  }
};

const upsertVerificationToken = async (email, currentToken) => {
  const token = generateRandomHexToken(6);
  const shouldBeBlocked =
    currentToken && currentToken.refreshCounter > Env.MaxRetrials;

  if (shouldBeBlocked) {
    console.warn(`Mail verification is blocked for ${email}`);
  }

  const expiredAt = new Date(Date.now() + Env.ExpiryMinutes);
  return prisma.securityToken.upsert({
    where: {
      subjectId_purpose: { subjectId: email, purpose: "EmailVerification" },
    },
    create: {
      subjectId: email,
      purpose: "EmailVerification",
      token,
      expiredAt,
    },
    update: {
      token,
      expiredAt,
      status: shouldBeBlocked ? "Blocked" : "Active",
      refreshCounter: {
        increment: 1,
      },
    },
  });
};
