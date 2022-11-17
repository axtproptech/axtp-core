import { prisma } from "@axtp/db-package";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";

import { object, mixed, string, ValidationError } from "yup";

const troolean = () =>
  mixed().oneOf(["all", "true", "false"]).optional().default("all");

let customerRequestSchema = object({
  verified: troolean(),
  active: troolean(),
  blocked: troolean(),
  accountId: string().optional(),
});

function getPureTroolean(value: "all" | "true" | "false") {
  if (value === "all") return undefined;
  return value === "true";
}

function getVerificationLevel(verified: string) {
  switch (verified) {
    case "true":
      return {
        notIn: ["Pending", "NotVerified"],
      };
    case "false":
      return {
        in: ["Pending", "NotVerified"],
      };
    default:
      return undefined;
  }
}

export const getCustomers: ApiHandler = async ({ req, res }) => {
  try {
    const query = req.query;
    const { verified, active, blocked, accountId } =
      customerRequestSchema.validateSync(query);

    if (accountId) {
      const singleCustomer = await prisma.blockchainAccount.findUnique({
        where: {
          accountId,
        },
        include: {
          customer: true,
        },
      });

      if (singleCustomer === null) {
        return res.status(404).json(null);
      }
      return res.status(200).json(singleCustomer.customer);
    }

    const customers = await prisma.customer.findMany({
      where: {
        // @ts-ignore
        verificationLevel: getVerificationLevel(verified),
        isBlocked: getPureTroolean(blocked),
        isActive: getPureTroolean(active),
      },
      include: {
        blockchainAccounts: true,
      },
    });
    return res.status(200).json(customers);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
