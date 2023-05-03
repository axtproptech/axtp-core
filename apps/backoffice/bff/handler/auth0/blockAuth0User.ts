import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { notFound, badRequest, notAcceptable } from "@hapi/boom";
import { object, string, ValidationError } from "yup";
import { getAccessToken } from "@/bff/handler/auth0/getAccessToken";

const loadCustomer = async (cuid: string) => {
  const customer = await prisma.customer.findUnique({
    where: { cuid },
    select: {
      email1: true,
      firstName: true,
      lastName: true,
      isActive: true,
      isBlocked: true,
      verificationLevel: true,
    },
  });

  if (!customer) {
    throw notFound();
  }

  return customer;
};

export const blockAuth0User: ApiHandler = async ({ req, res }) => {
  try {
    const querySchema = object({
      cuid: string(),
      accessToken: string(),
    });
    const query = req.query;
    const { cuid } = querySchema.validateSync(query);

    if (!cuid) {
      throw badRequest("cuid not provided");
    }

    const customer = await loadCustomer(cuid);
    if (!customer.isBlocked) {
      throw notAcceptable(`User ${cuid} is NOT blocked`);
    }
    const token = await getAccessToken();

    // TODO: implement
    //  1. search auth0 user by email
    // 2. get his id
    // 3. call update

    // TODO: call
    console.log("blockAuth0User", token);
    res.status(200).end();
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
