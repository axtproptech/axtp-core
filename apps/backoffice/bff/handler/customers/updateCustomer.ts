import { prisma, Customer } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";

import { boolean, date, mixed, object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";
import { mailService } from "@/bff/services/backofficeMailService/backofficeMailService";

let customerRequestSchema = object({ cuid: string() });

let customerUpdateBodySchema = object({
  firstName: string().optional(),
  lastName: string().optional(),
  firstNameMother: string().optional(),
  lastNameMother: string().optional(),
  email1: string().optional(),
  phone1: string().optional(),
  dateOfBirth: date().optional(),
  placeOfBirth: string().optional(),
  verificationLevel: mixed().oneOf(["Level1", "Level2"]).optional(),
  isBlocked: boolean().optional(),
  isActive: boolean().optional(),
  isInvited: boolean().optional(),
  isBrazilian: boolean().optional(),
  isPep: boolean().optional(),
});

export const updateCustomer: ApiHandler = async ({ req, res }) => {
  try {
    const { cuid } = customerRequestSchema.validateSync(req.query);
    const {
      verificationLevel,
      isBrazilian,
      isPep,
      isBlocked,
      isActive,
      isInvited,
      firstName,
      lastName,
      email1,
      phone1,
      dateOfBirth,
      placeOfBirth,
      firstNameMother,
      lastNameMother,
    } = customerUpdateBodySchema.validateSync(req.body);

    const customer = await prisma.customer.update({
      where: { cuid },
      data: {
        firstName,
        lastName,
        email1,
        phone1,
        dateOfBirth,
        placeOfBirth,
        verificationLevel,
        isBlocked,
        isActive,
        isInvited,
        firstNameMother,
        lastNameMother,
        isInBrazil: isBrazilian,
        isPoliticallyExposed: isPep,
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

    let action = "Customer Updated";
    if (verificationLevel === "Level1" || verificationLevel === "Level2") {
      action = "Customer Verified";
      await mailService.external.sendSuccessfulVerification({
        params: {
          firstName: customer.firstName,
        },
        to: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email1: customer.email1,
        },
      });
    } else if (isBlocked) {
      action = "Customer Blocked";
      // TODO: send external mail
    } else if (isBlocked === false) {
      action = "Customer Unblocked";
      // TODO: send external mail
    } else if (isActive) {
      action = "Customer (Re)Activated";
      // TODO: send external mail
    } else if (isActive === false) {
      action = "Customer Deactivated";
      // TODO: send external mail
    } else if (isInvited) {
      action = "Customer Invited to Exclusive Area";
      // mail sent by auth0 user creation!
    }

    await mailService.internal.sendCustomerUpdated({
      action,
      customer,
    });

    return res.status(200).json(asFullCustomerResponse(customer));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
