import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axt/db-package";
// @ts-ignore
import jotform from "jotform";
import { JotFormSubmissionContent } from "@/bff/handler/customer/jotFormSubmissionResponse";
import { JotFormSubmissionParser } from "@/bff/handler/customer/jotFormSubmissionParser";
import { internal } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";

jotform.options({
  debug: process.env.NODE_ENV !== "production",
  apiKey: process.env.JOTFORM_API_KEY || "",
});

export const registerCustomer: HandlerFunction = async (req, res) => {
  try {
    const { submission_id } = req.body;
    const submission = (await jotform.getSubmission(
      submission_id
    )) as JotFormSubmissionContent;
    const answers = new JotFormSubmissionParser(submission);

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        cpfCnpj: answers.cpf,
      },
    });

    if (existingCustomer) {
      res.redirect(302, `/kyc/new/success?id=${existingCustomer.id}`);
      return;
    }

    const documents = answers.residentProofUrls.map((url) => ({
      type: "ProofOfAddress",
      url,
    }));
    documents.push(
      ...answers.documentUrls.map((url) => ({
        type: answers.documentType === "cnh" ? "DriverLicense" : "Id",
        url,
      }))
    );

    const newCustomer = await prisma.customer.create({
      data: {
        firstName: answers.fullName.first,
        lastName: answers.fullName.last,
        email1: answers.email,
        cpfCnpj: answers.cpf,
        dateOfBirth: answers.birthDate,
        placeOfBirth: answers.birthPlace,
        verificationLevel: "Pending",
        nationality: "",
        phone1: answers.phone,
        profession: answers.occupation,
        documents: {
          createMany: {
            data: {
              type: "ProofOfAddress",
              url: "SomeUrl",
            },
          },
        },
        addresses: {
          create: {
            state: answers.address.state,
            city: answers.address.city,
            type: "Residential",
            country: answers.address.country,
            line1: answers.address.addr_line1,
            line2: answers.address.addr_line2 || "",
            line3: "",
            line4: "",
            postCodeZip: answers.address.postal,
          },
        },
      },
    });

    res.redirect(302, `/kyc/new/success?id=${newCustomer.id}`);
  } catch (e: any) {
    handleError({ e, res });
  }
};
