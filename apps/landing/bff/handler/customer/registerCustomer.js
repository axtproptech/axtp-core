import { prisma } from "@axt/db-package";
// @ts-ignore
import jotform from "jotform";
import { JotFormSubmissionParser } from "./jotFormSubmissionParser";

jotform.options({
  debug: process.env.NODE_ENV !== "production",
  apiKey: process.env.JOTFORM_API_KEY || "",
});

export const registerCustomer = async (req, res) => {
  try {
    const { submission_id } = req.body;
    const submission = await jotform.getSubmission(submission_id);
    const answers = new JotFormSubmissionParser(submission);

    const existingCustomer = await prisma.customer.find({
      where: {
        email1: answers.email,
      },
    });

    if (existingCustomer.length) {
      res.redirect(302, `/`);
      return;
    }

    const newCustomer = await prisma.customer.create({
      data: {
        firstName: answers.fullName.first,
        lastName: answers.fullName.last,
        email1: answers.email,
        verificationLevel: "NotVerified",
        nationality: "",
        phone1: answers.phone,
      },
    });
    res.redirect(302, `/?registeredSuccess=${newCustomer.firstName}`);
  } catch (e) {
    // TODO: logging
    res.redirect(302, "/500");
  }
};
