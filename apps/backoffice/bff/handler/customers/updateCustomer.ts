import { prisma, Customer } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";

import { boolean, date, mixed, object, string, ValidationError } from "yup";
import { asFullCustomerResponse } from "./asFullCustomerResponse";
import { mailService } from "@/bff/backofficeMailService";

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
});

async function sendSuccessfulVerificationMail(customer: Customer) {
  return mailService.sendInternalCustomerUpdated({
    action: "Customer Verified",
    customer,
  });
}
async function sendBlockMail(customer: Customer) {
  return mailService.sendInternalCustomerUpdated({
    action: "Customer Blocked",
    customer,
  });
}

export const updateCustomer: ApiHandler = async ({ req, res }) => {
  try {
    const { cuid } = customerRequestSchema.validateSync(req.query);
    const {
      verificationLevel,
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
    } else if (isBlocked) {
      action = "Customer Blocked";
    } else if (isBlocked === false) {
      action = "Customer Unblocked";
    } else if (isActive) {
      action = "Customer (Re)Activated";
    } else if (isActive === false) {
      action = "Customer Deactivated";
    } else if (isInvited) {
      action = "Customer Invited to Exclusive Area";
    }

    await mailService.sendInternalCustomerUpdated({
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
