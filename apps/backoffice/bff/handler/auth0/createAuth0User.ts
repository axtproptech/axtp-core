import { ApiHandler } from "@/bff/types/apiHandler";
import { prisma } from "@axtp/db";
import { notFound, badRequest, notAcceptable } from "@hapi/boom";
import { object, string, ValidationError } from "yup";
import { mailService } from "@/bff/mailService";
import { Auth0Service } from "./internal/auth0Service";
import { findCustomerById } from "./internal/findCustomerById";
import * as process from "process";
export const createAuth0User: ApiHandler = async ({ req, res }) => {
  try {
    console.time("createAuth0User");
    const querySchema = object({ cuid: string().required() });
    const query = req.query;
    const { cuid } = querySchema.validateSync(query);

    const customer = await findCustomerById(cuid);
    if (customer.isBlocked || !customer.isActive) {
      throw notAcceptable(`User ${cuid} is blocked or not active`);
    }

    console.log("creating user...");
    const token = await Auth0Service.getAccessToken();

    console.log("token", token);

    const auth0Service = new Auth0Service(token);
    const { firstName, lastName, email1 } = customer;
    const accessLink = await auth0Service.createUser({
      cuid,
      email: email1,
      firstName,
      lastName,
    });
    console.timeLog("createAuth0User");
    console.log("sending mail...");
    await mailService.sendExclusiveAreaInvitation({
      to: customer.email1,
      params: {
        firstName: customer.firstName,
        accessLink: accessLink,
        exclusiveAreaUrl: process.env.NEXTAUTH_URL + "/exclusive",
      },
    });
    console.log("mail sent");
    console.timeLog("createAuth0User");

    // console.log("createAuth0User", createdUser, token, response);
    res.status(201).end();
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  } finally {
    console.log("finally");
    console.timeEnd("createAuth0User");
  }
};
