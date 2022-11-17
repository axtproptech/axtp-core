import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";

import { boolean, mixed, object, string, ValidationError } from "yup";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { asFullCustomerResponse } from "../../../pages/api/admin/customers/asFullCustomerResponse";

let customerRequestSchema = object({ cuid: string() });

// TODO: extend as needed
let customerUpdateBodySchema = object({
  verificationLevel: mixed().oneOf(["Level1", "Level2"]),
  isBlocked: boolean().default(false),
  isActive: boolean().default(true),
});

export const updateCustomer: ApiHandler = async ({ req, res }) => {
  try {
    const { cuid } = customerRequestSchema.validateSync(req.query);
    const { verificationLevel, isBlocked, isActive } =
      customerUpdateBodySchema.validateSync(req.body);

    const customer = await prisma.customer.update({
      where: { cuid },
      data: {
        verificationLevel,
        isBlocked,
        isActive,
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
