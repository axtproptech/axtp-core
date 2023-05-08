import { notFound } from "@hapi/boom";
import { prisma } from "@axtp/db";

export const findCustomerById = async (cuid: string) => {
  const customer = await prisma.customer.findUnique({
    where: { cuid },
    select: {
      email1: true,
      firstName: true,
      lastName: true,
      isActive: true,
      isBlocked: true,
      isInvited: true,
      verificationLevel: true,
    },
  });

  if (!customer) {
    throw notFound();
  }

  return customer;
};
