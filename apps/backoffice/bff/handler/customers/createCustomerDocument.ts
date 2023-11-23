import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma, DocumentType } from "@axtp/db";
import { badRequest, notFound } from "@hapi/boom";
import { object, ValidationError, string, mixed } from "yup";

const documentQuerySchema = object({
  cuid: string().required(),
});

const documentBodySchema = object({
  type: mixed()
    .oneOf([
      "Selfie",
      "Id",
      "DriverLicense",
      "Passport",
      "ProofOfAddress",
      "Other",
    ])
    .required(),
  url: string().required(),
});

export const createCustomerDocument: ApiHandler = async ({ req, res }) => {
  try {
    const { cuid } = documentQuerySchema.validateSync(req.query);
    const { type, url } = documentBodySchema.validateSync(req.body);

    const customer = await prisma.customer.findUnique({
      where: {
        cuid,
      },
    });

    if (!customer) {
      throw notFound();
    }

    await prisma.document.create({
      data: {
        type,
        url,
        customer: {
          connect: {
            id: customer.id,
          },
        },
      },
    });
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
