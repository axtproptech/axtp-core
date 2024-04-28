import { MailService } from "@axtp/core";
import { EmailTemplates } from "../mail/emailTemplates";

const Env = {
  Mail: {
    BrevoApiKey: process.env.NEXT_SERVER_BREVO_API_KEY || "",
    SenderName: process.env.NEXT_SERVER_BREVO_SENDER_NAME || "",
    SenderMail: process.env.NEXT_SERVER_BREVO_SENDER_EMAIL || "",
    ReceiverKycMail: process.env.NEXT_SERVER_AXT_KYC_MAIL_ADDRESS || "",
  },
};

async function sendExternalNewLeadMail({ firstName, email }) {
  const mailService = new MailService(Env.Mail.BrevoApiKey);
  await mailService.sendTransactionalEmail({
    sender: {
      name: Env.Mail.SenderName,
      email: Env.Mail.SenderMail,
    },
    to: [
      {
        name: firstName,
        email,
      },
    ],
    templateId: EmailTemplates.NewLead,
    tags: ["NewLead"],
    params: {
      firstName,
    },
  });
  console.info(`New External Lead Mail sent to ${email}`);
}

async function sendInternalNewLeadMail({
  email,
  firstName,
  lastName,
  isBrazilian,
  phone,
}) {
  const mailService = new MailService(Env.Mail.BrevoApiKey);
  await mailService.sendTransactionalEmail({
    sender: {
      name: Env.Mail.SenderName,
      email: Env.Mail.SenderMail,
    },
    to: [
      {
        name: firstName,
        email: Env.Mail.ReceiverKycMail,
      },
    ],
    templateId: EmailTemplates.InternalNewLead,
    tags: ["NewLead"],
    params: { email, firstName, lastName, isBrazilian, phone },
  });
  console.info(`New Internal Lead Mail sent.`);
}

export const sendNewLeadMails = async ({
  email,
  firstName,
  lastName,
  isBrazilian,
  phone,
}) => {
  return Promise.all([
    sendExternalNewLeadMail({ firstName, email }),
    sendInternalNewLeadMail({ firstName, lastName, isBrazilian, phone, email }),
  ]);
};
