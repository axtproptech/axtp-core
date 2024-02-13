import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest, notFound } from "@hapi/boom";

import { mixed, number, object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";
import { mailService } from "@/bff/services/backofficeMailService/backofficeMailService";

let customerRequestSchema = object({
  cuid: string().required(),
  bankInfoId: number().required(),
});
let customerUpdateBankInfoSchema = object({
  type: mixed().oneOf(["Pix", "Iban"]).required(),
  identifier: string().required(),
});

export const updateCustomerBankInformation: ApiHandler = async ({
  req,
  res,
}) => {
  try {
    const { cuid, bankInfoId } = customerRequestSchema.validateSync(req.query);
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

    await prisma.bankInformation.update({
      where: { id: bankInfoId },
      data: {
        type,
        identifier,
      },
    });

    customer = await prisma.customer.findUnique({
      where: { cuid },
      include: {
        termsOfUse: true,
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
      action: "Customer Bank Information Updated",
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
