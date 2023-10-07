import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
// @ts-ignore
import { bffLoggingService } from "@/bff/bffLoggingService";
import {date, object, string} from 'yup';


const CpfCnpjRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const CustomerSchema= object({
  firstName: string().required(),
  lastName: string().required(),
  firstNameMother: string().required(),
  lastNameMother: string().required(),
  email1: string().required(),
  cpfCnpj: string().matches(CpfCnpjRegex).required(),
  dateOfBirth: date().required(),
  placeOfBirth: string().required(),
  nationality: string(),
  phone1: string(),
  profession: string(),
  documents: object({

  })
  address: object({
    state: string().required(),
    city: string().required(),
    line1: string(),
    line2: string(),
    line3: string(),
    line4: string(),
    postCodeZip: string().required(),
    country: string().required(),
  }).required()
});


export const registerCustomer: RouteHandlerFunction = async (req, res) => {
  try {
    const { submission_id } = req.body;
    const submission = (await jotform.getSubmission(
      submission_id
    )) as JotFormSubmissionContent;
    const answers = new JotFormSubmissionParser(submission);
    bffLoggingService.info({
      msg: "Registering customer",
      domain: "customer",
      detail: {
        answers,
        submission,
      },
    });

    // check if is registered already
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        cpfCnpj: answers.cpf,
      },
    });

    if (existingCustomer) {
      bffLoggingService.info({
        msg: "Customer exists already",
        domain: "customer",
        detail: { cpfCnpj: answers.cpf },
      });
      res.redirect(302, `/kyc/setup/success?cuid=${existingCustomer.cuid}`);
      return;
    }

    const preregisteredCustomer = await prisma.customer.findFirst({
      where: {
        email1: answers.email,
      },
    });

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

    let newCustomer;
    if (preregisteredCustomer) {
      newCustomer = await prisma.customer.update({
        where: {
          cuid: preregisteredCustomer.cuid,
        },
        data: {
          firstName: answers.fullName.first,
          lastName: answers.fullName.last,
          firstNameMother: answers.mothersName.first,
          lastNameMother: answers.mothersName.last,
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
              // @ts-ignore
              data: documents,
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
    } else {
      newCustomer = await prisma.customer.create({
        data: {
          firstName: answers.fullName.first,
          lastName: answers.fullName.last,
          firstNameMother: answers.mothersName.first,
          lastNameMother: answers.mothersName.last,
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
              // @ts-ignore
              data: documents,
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
    }

    bffLoggingService.info({
      msg: "New customer registered",
      domain: "customer",
      detail: { cpfCnpj: answers.cpf, cuid: newCustomer.cuid },
    });

    res.redirect(302, `/kyc/setup/success?cuid=${newCustomer.cuid}`);
  } catch (e: any) {
    // TODO: logging
    res.redirect(302, "/500");
  }
};
