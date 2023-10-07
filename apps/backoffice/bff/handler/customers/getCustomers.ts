import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";

import { object, mixed, string, number, ValidationError } from "yup";

const troolean = () =>
  mixed().oneOf(["all", "true", "false"]).optional().default("all");

let customerRequestSchema = object({
  verified: troolean().optional(),
  active: troolean().optional(),
  blocked: troolean().optional(),
  brazilian: troolean().optional(),
  invited: troolean().optional(),
  name: string().optional(),
  email: string().optional(),
  cpf: string().optional(),
  accountId: string().optional(),
  page: number().nullable().optional().default(null),
  offset: number().nullable().optional().default(null),
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
    const {
      verified,
      active,
      brazilian,
      invited,
      blocked,
      name,
      cpf,
      accountId,
      page,
      email,
      offset,
    } = customerRequestSchema.validateSync(query);

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
    const shouldPaginate = page !== null && offset !== null;
    const paginationQuery = shouldPaginate
      ? {
          skip: (page - 1) * offset,
          take: offset,
        }
      : {};

    const query_prisma = {
      ...paginationQuery,
      where: {
        AND: [
          { verificationLevel: getVerificationLevel(verified) },
          { isBlocked: getPureTroolean(blocked) },
          { isInBrazil: getPureTroolean(brazilian) },
          { isInvited: getPureTroolean(invited) },
          { isActive: getPureTroolean(active) },
          { cpfCnpj: cpf },
          {
            OR: [
              {
                firstName: {
                  contains: name,
                },
              },
              {
                lastName: {
                  contains: name,
                },
              },
            ],
          },
          {
            OR: [
              {
                email1: {
                  contains: email,
                },
              },
              {
                email2: {
                  contains: email,
                },
              },
            ],
          },
        ],
      },
      include: {
        blockchainAccounts: true,
      },
    };

    const [customers, count] = await prisma.$transaction([
      // @ts-ignore
      prisma.customer.findMany(query_prisma),
      // @ts-ignore
      prisma.customer.count({ where: query_prisma.where }),
    ]);

    return res.status(200).json({ customers, count });
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
