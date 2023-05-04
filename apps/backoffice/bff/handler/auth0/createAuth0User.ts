import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { notFound, badRequest, notAcceptable } from "@hapi/boom";
import { object, string, ValidationError } from "yup";
import { mailService } from "@/bff/mailService";

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

    // const token = await Auth0Service.getAccessToken();
    // const auth0Service = new Auth0Service(token);
    // const { firstName, lastName, email1 } = customer;
    // await auth0Service.createUser({
    //   cuid,
    //   email: email1,
    //   firstName,
    //   lastName,
    // });
    await mailService.sendExclusiveAreaInvitation({
      to: customer.email1,
      params: {
        firstName: customer.firstName,
      },
    });

    // console.log("createAuth0User", createdUser, token, response);
    res.status(201).end();
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
