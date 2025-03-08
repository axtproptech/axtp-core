import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
// @ts-ignore
import { bffLoggingService } from "@/bff/bffLoggingService";
import { boolean, date, mixed, object, string } from "yup";
import { conflict } from "@hapi/boom";
import { getEnvVar } from "@/bff/getEnvVar";
import { handleError } from "@/bff/handler/handleError";
import { cpf as CpfValidator, cnpj as CnpjValidator } from "cpf-cnpj-validator";
import { createBlockchainAccountData } from "./createBlockchainAccountData";
import { sendSuccessfulRegistrationMails } from "./sendSuccessfulRegistrationMails";
import { createCrmContact } from "@/bff/handler/customer/registerCustomer/createCrmContact";
import { R2ObjectUri } from "@axtp/core/file";

function isValidCpfOrCnpj(cpfCnpj?: string) {
  if (!cpfCnpj) {
    return false;
  }
  return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpfCnpj)
    ? CpfValidator.isValid(cpfCnpj)
    : CnpjValidator.isValid(cpfCnpj);
}

const CustomerSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  firstNameMother: string().required(),
  lastNameMother: string().required(),
  email: string().required(),
  cpf: string()
    .required()
    .test("validate-cpf-cnpj", "Invalid CPF or CNPJ", isValidCpfOrCnpj),
  birthDate: date().required(),
  birthPlace: string().required(),
  phone: string().required(),
  profession: string().required(),
  pep: boolean().required(),
  streetAddress: string().required(),
  complementaryStreetAddress: string(),
  state: string().required(),
  city: string().required(),
  zipCode: string().required(),
  countryCode: string().max(2).optional(),
  proofOfAddress: string().required(), // object Id
  documentType: mixed().oneOf(["cnh", "rne"]).required(),
  frontSide: string().required(), // object Id
  backSide: string(),
  publicKey: string().required(),
  agreeTerms: boolean().oneOf([true]).required(),
  agreeSafetyTerms: boolean().oneOf([true]).required(),
});

export const registerCustomer: RouteHandlerFunction = async (req, res) => {
  try {
    const data = CustomerSchema.validateSync(req.body);

    // check if is registered already
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        cpfCnpj: data.cpf,
      },
    });

    if (existingCustomer) {
      bffLoggingService.info({
        msg: "Customer exists already",
        domain: "customer",
        detail: { cpfCnpj: data.cpf },
      });
      throw conflict("Customer already exists");
    }

    const preregisteredCustomer = await prisma.customer.findFirst({
      where: {
        email1: data.email,
      },
    });

    const blockchainAccountData = createBlockchainAccountData(data.publicKey);
    const bucket = getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET");
    const accountId = getEnvVar("NEXT_SERVER_CF_R2_ACCOUNT_ID");
    const documents = [
      {
        type: "ProofOfAddress",
        url: new R2ObjectUri({
          objectId: data.proofOfAddress,
          bucket,
          accountId,
        }).toString(),
      },
    ];

    documents.push({
      type: data.documentType === "cnh" ? "DriverLicense" : "Id",
      url: new R2ObjectUri({
        objectId: data.frontSide,
        bucket,
        accountId,
      }).toString(),
    });

    if (data.backSide) {
      documents.push({
        type: data.documentType === "cnh" ? "DriverLicense" : "Id",
        url: new R2ObjectUri({
          objectId: data.backSide,
          bucket,
          accountId,
        }).toString(),
      });
    }

    let newCustomer;
    if (preregisteredCustomer) {
      newCustomer = await prisma.customer.update({
        where: {
          cuid: preregisteredCustomer.cuid,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          firstNameMother: data.firstNameMother,
          lastNameMother: data.lastNameMother,
          email1: data.email,
          cpfCnpj: data.cpf,
          dateOfBirth: data.birthDate,
          placeOfBirth: data.birthPlace,
          verificationLevel: "Pending",
          nationality: "",
          phone1: data.phone,
          profession: data.profession,
          isPoliticallyExposed: data.pep,
          documents: {
            createMany: {
              // @ts-ignore
              data: documents,
            },
          },
          addresses: {
            create: {
              state: data.state,
              city: data.city,
              type: "Residential",
              country: data.countryCode || "BR",
              line1: data.streetAddress,
              line2: data.complementaryStreetAddress || "",
              line3: "",
              line4: "",
              postCodeZip: data.zipCode,
            },
          },
          blockchainAccounts: {
            create: blockchainAccountData,
          },
        },
      });
    } else {
      newCustomer = await prisma.customer.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          firstNameMother: data.firstNameMother,
          lastNameMother: data.lastNameMother,
          email1: data.email,
          cpfCnpj: data.cpf,
          dateOfBirth: data.birthDate,
          placeOfBirth: data.birthPlace,
          verificationLevel: "Pending",
          nationality: "",
          phone1: data.phone,
          profession: data.profession,
          isPoliticallyExposed: data.pep,
          documents: {
            createMany: {
              // @ts-ignore
              data: documents,
            },
          },
          addresses: {
            create: {
              state: data.state,
              city: data.city,
              type: "Residential",
              country: data.countryCode || "BR",
              line1: data.streetAddress,
              line2: data.complementaryStreetAddress || "",
              line3: "",
              line4: "",
              postCodeZip: data.zipCode,
            },
          },
          blockchainAccounts: {
            create: blockchainAccountData,
          },
        },
      });
    }

    await Promise.all([
      sendSuccessfulRegistrationMails(newCustomer),
      createCrmContact(newCustomer),
    ]);

    bffLoggingService.info({
      msg: "New customer registered",
      domain: "customer",
      detail: { cpfCnpj: data.cpf, cuid: newCustomer.cuid },
    });

    res.status(201).json({
      customerId: newCustomer.cuid,
    });
  } catch (e: any) {
    handleError({ e, res });
  }
};
