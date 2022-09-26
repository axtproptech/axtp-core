import { prisma } from "@axt/db-package";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";

import { object, mixed, ValidationError } from "yup";

const troolean = () =>
  mixed().oneOf(["all", "true", "false"]).optional().default("all");

let customerRequestSchema = object({
  verified: troolean(),
  active: troolean(),
  blocked: troolean(),
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
    const { verified, active, blocked } =
      customerRequestSchema.validateSync(query);
    const customers = await prisma.customer.findMany({
      where: {
        // @ts-ignore
        verificationLevel: getVerificationLevel(verified),
        isBlocked: getPureTroolean(blocked),
        isActive: getPureTroolean(active),
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
