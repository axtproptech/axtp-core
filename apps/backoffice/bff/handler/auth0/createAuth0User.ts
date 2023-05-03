import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { notFound, badRequest, notAcceptable } from "@hapi/boom";
import { object, string, ValidationError } from "yup";
import { getAccessToken } from "@/bff/handler/auth0/getAccessToken";
import { provideAuth0ApiClient } from "@/bff/handler/auth0/provideAuth0ApiClient";
import { randomUUID } from "crypto";
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

export const createAuth0User: ApiHandler = async ({ req, res }) => {
  try {
    const querySchema = object({ cuid: string() });
    const query = req.query;
    const { cuid } = querySchema.validateSync(query);

    if (!cuid) {
      throw badRequest("cuid not provided");
    }

    const customer = await loadCustomer(cuid);
    if (customer.isBlocked || !customer.isActive) {
      throw notAcceptable(`User ${cuid} is blocked or not active`);
    }

    const userToBeCreated = {
      connection: process.env.NEXT_SERVER_AUTH0_LANDING_CONNECTION,
      email: customer.email1,
      given_name: customer.firstName,
      family_name: customer.lastName,
      name: customer.firstName,
      password: randomUUID(),
      user_metadata: {
        cuid,
      },
      email_verified: false,
    };

    const token = await getAccessToken();
    const auth0Client = provideAuth0ApiClient(token);
    const { response } = await auth0Client.post("/users", userToBeCreated);
    console.log("createAuth0User", userToBeCreated, token, response);
    res.status(201).end();
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
