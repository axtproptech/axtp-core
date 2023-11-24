import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";

import { number, object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";

let customerRequestSchema = object({
  cuid: string().required(),
  addressId: number().required(),
});
let customerUpdateAddressBodySchema = object({
  line1: string().optional(),
  line2: string().optional(),
  line3: string().optional(),
  line4: string().optional(),
  city: string().optional(),
  postCodeZip: string().optional(),
  state: string().optional(),
  country: string().optional(),
});

export const updateCustomerAddress: ApiHandler = async ({ req, res }) => {
  try {
    const { cuid, addressId } = customerRequestSchema.validateSync(req.query);
    const { city, line4, state, line2, line3, line1, country, postCodeZip } =
      customerUpdateAddressBodySchema.validateSync(req.body);

    await prisma.address.update({
      where: { id: addressId },
      data: {
        city,
        country,
        line1,
        line2,
        line3,
        line4,
        postCodeZip,
        state,
      },
    });

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

    return res.status(200).json(asFullCustomerResponse(customer));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
