import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";

import { object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";

let customerRequestSchema = object({ cuid: string().required() });

export const getCustomer: ApiHandler = async ({ req, res }) => {
  try {
    const query = req.query;
    const { cuid } = customerRequestSchema.validateSync(query);
    const customer = await prisma.customer.findUnique({
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
