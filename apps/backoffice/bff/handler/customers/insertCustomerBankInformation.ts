import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest, notFound } from "@hapi/boom";

import { mixed, object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";
import { mailService } from "@/bff/services/backofficeMailService/backofficeMailService";

let customerRequestSchema = object({
  cuid: string().required(),
});
let customerUpdateBankInfoSchema = object({
  type: mixed().oneOf(["Pix", "Iban"]).required(),
  identifier: string().required(),
});

export const insertCustomerBankInformation: ApiHandler = async ({
  req,
  res,
}) => {
  try {
    const { cuid } = customerRequestSchema.validateSync(req.query);
    const { type, identifier } = customerUpdateBankInfoSchema.validateSync(
      req.body
    );

    let customer = await prisma.customer.findUnique({
      where: {
        cuid,
      },
    });

    if (!customer) {
      throw notFound();
    }
    await prisma.bankInformation.create({
      data: {
        type,
        identifier,
        customer: {
          connect: {
            id: customer.id,
          },
        },
      },
    });

    customer = await prisma.customer.findUnique({
      where: { cuid },
      include: {
        signedDocuments: true,
        blockchainAccounts: true,
        documents: {
          where: {
            active: true,
          },
        },
        verificationResult: true,
        addresses: true,
        bankInformation: true,
      },
    });

    await mailService.internal.sendCustomerUpdated({
      action: "Customer Bank Information Added",
      // @ts-ignore
      customer,
    });

    res.status(200).json(asFullCustomerResponse(customer));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
