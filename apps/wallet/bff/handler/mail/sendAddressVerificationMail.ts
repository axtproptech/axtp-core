import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "../handleError";
import { getEnvVar } from "@/bff/getEnvVar";
import { prisma, SecurityToken } from "@axtp/db";
import { object, string } from "yup";
import { tooManyRequests, unauthorized } from "@hapi/boom";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { MailClient } from "@/bff/mailClient";
import { EmailTemplates } from "@/bff/types/emailTemplates";
import { generateRandomHexToken } from "@/bff/generateRandomHexToken";

const SendAddressVerificationMailBody = object({
  emailAddress: string().required(),
  name: string().required(),
});

const Minutes = 60 * 1000;
export const sendAddressVerificationMail: RouteHandlerFunction = async (
  req,
  res
) => {
  try {
    const { emailAddress, name } = SendAddressVerificationMailBody.validateSync(
      req.body
    );

    const existingToken = await prisma.securityToken.findUnique({
      where: {
        subjectId_purpose: {
          subjectId: emailAddress,
          purpose: "EmailVerification",
        },
      },
    });

    console.log("existingToken", existingToken);
    if (existingToken && existingToken.status === "Blocked") {
      throw unauthorized(`This ${emailAddress} is blocked`);
    }

    const rateLimitWindow =
      Number(
        getEnvVar("NEXT_SERVER_MAIL_VERIFICATION_RATE_LIMIT_MINUTES") || "0"
      ) * Minutes;
    if (
      existingToken &&
      existingToken.updatedAt.getTime() > Date.now() - rateLimitWindow
    ) {
      throw tooManyRequests("Too many requests");
    }

    const { token } = await upsertVerificationToken(
      emailAddress,
      existingToken
    );
    const mailClient = new MailClient(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
    await mailClient.sendTransactionalEmail({
      sender: {
        name: getEnvVar("NEXT_SERVER_BREVO_SENDER_NAME"),
        email: getEnvVar("NEXT_SERVER_BREVO_SENDER_EMAIL"),
      },
      to: [
        {
          name,
          email: emailAddress,
        },
      ],
      templateId: EmailTemplates.AddressVerification,
      tags: ["EmailVerification"],
      params: {
        token,
        name,
      },
    });
    bffLoggingService.info({
      msg: `Verification Mail sent to ${emailAddress}`,
      domain: "mail",
    });
    res.status(204).end();
  } catch (e: any) {
    handleError({ e, res });
  }
};

const upsertVerificationToken = async (
  email: string,
  currentToken: SecurityToken | null
) => {
  const token = generateRandomHexToken(6);
  const expiryMinutes = Number(
    getEnvVar("NEXT_SERVER_MAIL_VERIFICATION_EXPIRY_MINUTES")
  );
  const maxRetrials = Number(
    getEnvVar("NEXT_SERVER_MAIL_VERIFICATION_MAX_TRIALS")
  );
  const shouldBeBlocked =
    currentToken && currentToken.refreshCounter > maxRetrials;

  if (shouldBeBlocked) {
    bffLoggingService.warn({
      msg: `Mail verification is blocked for ${email}`,
      domain: "mail",
    });
  }

  const expiredAt = new Date(Date.now() + expiryMinutes * Minutes);
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
