import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";

import { boolean, mixed, object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";

let customerRequestSchema = object({ cuid: string() });

// TODO: extend as needed
let customerUpdateBodySchema = object({
  verificationLevel: mixed().oneOf(["Level1", "Level2"]),
  isBlocked: boolean(),
  isActive: boolean(),
  isInvited: boolean(),
});

export const updateCustomer: ApiHandler = async ({ req, res }) => {
  try {
    const { cuid } = customerRequestSchema.validateSync(req.query);
    const { verificationLevel, isBlocked, isActive, isInvited } =
      customerUpdateBodySchema.validateSync(req.body);

    const customer = await prisma.customer.update({
      where: { cuid },
      data: {
        verificationLevel,
        isBlocked,
        isActive,
        isInvited,
      },
      include: {
        termsOfUse: true,
        blockchainAccounts: true,
        documents: true,
        verificationResult: true,
        addresses: true,
      },
    });

    if (!customer) {
      throw notFound();
    }

    return res.status(200).json(asFullCustomerResponse(customer));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
