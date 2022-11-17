import { prisma } from "@axtp/db";
import jotform from "jotform";
import { JotFormSubmissionParser } from "./jotFormSubmissionParser";
import cuid from "cuid";
import pRetry from "p-retry";

jotform.options({
  debug: process.env.NODE_ENV !== "production",
  apiKey: process.env.JOTFORM_API_KEY || "",
});

const fetchSubmissionData = async (submissionId) => {
  const submission = await jotform.getSubmission(submissionId);
  const answers = new JotFormSubmissionParser(submission);
  if (!answers.email) {
    return Promise.reject();
  }
  return answers;
};

export const registerCustomer = async (req, res) => {
  try {
    const { submission_id } = req.body;
    const answers = await pRetry(() => fetchSubmissionData(submission_id), {
      retries: 3,
    });
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email1: answers.email,
      },
    });

    if (existingCustomer) {
      res.redirect(302, `/?status=existsAlready`);
      return;
    }

    await prisma.customer.create({
      data: {
        cpfCnpj: `unverified-${cuid()}`,
        firstName: answers.fullName.first,
        lastName: answers.fullName.last,
        email1: answers.email,
        phone1: answers.phone,
        verificationLevel: "NotVerified",
      },
    });
    res.redirect(302, `/?status=success`);
  } catch (e) {
    console.error("registerCustomer", e.message);
    res.redirect(302, "/?status=error");
  }
};
