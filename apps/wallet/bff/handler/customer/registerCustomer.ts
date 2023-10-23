import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
// @ts-ignore
import { bffLoggingService } from "@/bff/bffLoggingService";
import { date, object, string, mixed, boolean } from "yup";
import { badRequest, conflict } from "@hapi/boom";
import { createR2BucketObjectUrl } from "@axtp/core/common/r2";
import { getEnvVar } from "@/bff/getEnvVar";
import { Address } from "@signumjs/core";
import { handleError } from "@/bff/handler/handleError";
import { cpf as CpfValidator, cnpj as CnpjValidator } from "cpf-cnpj-validator";

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
  streetAddress: string().required(),
  complementaryStreetAddress: string(),
  state: string().required(),
  city: string().required(),
  zipCode: string().required(),
  country: string().required(),
  proofOfAddress: string().required(), // object Id
  documentType: mixed().oneOf(["cnh", "rne"]).required(),
  frontSide: string().required(), // object Id
  backSide: string(),
  publicKey: string().required(),
  agreeTerms: boolean().oneOf([true]).required(),
  agreeSafetyTerms: boolean().oneOf([true]).required(),
});

function createBlockchainAccountData(publicKey: string) {
  try {
    const isTestnet = getEnvVar("NEXT_PUBLIC_LEDGER_IS_TESTNET") === "true";
    const address = Address.fromPublicKey(publicKey, isTestnet ? "TS" : "S");
    return {
      publicKey,
      accountId: address.getNumericId(),
      rsAddress: address.getReedSolomonAddress(true),
    };
  } catch (e) {
    throw badRequest("Invalid public key");
  }
}

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
        url: createR2BucketObjectUrl({
          objectId: data.proofOfAddress,
          bucket,
          accountId,
        }),
      },
    ];

    documents.push({
      type: data.documentType === "cnh" ? "DriverLicense" : "Id",
      url: createR2BucketObjectUrl({
        objectId: data.frontSide,
        bucket,
        accountId,
      }),
    });

    if (data.backSide) {
      documents.push({
        type: data.documentType === "cnh" ? "DriverLicense" : "Id",
        url: createR2BucketObjectUrl({
          objectId: data.backSide,
          bucket,
          accountId,
        }),
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
              country: data.country,
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
              country: data.country,
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

    const termsOfUseId = Number(getEnvVar("ACTIVE_TERMS_OF_USE_ID") || "1");
    await prisma.termsOfUseOnCustomer.upsert({
      where: {
        customerId_termsOfUseId: {
          termsOfUseId,
          customerId: newCustomer.id,
        },
      },
      update: {
        accepted: true,
      },
      create: {
        accepted: true,
        termsOfUseId,
        customerId: newCustomer.id,
      },
    });

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
