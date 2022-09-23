import { prisma } from "@axt/db-package";
import { ApiHandler } from "@/bff/types/apiHandler";

import { object, mixed } from "yup";

let customerRequestSchema = object({
  verified: mixed()
    .oneOf(["all", "verified", "pending"])
    .optional()
    .default("all"),
});

function getVerificationLevel(verified: string) {
  switch (verified) {
    case "verified":
      return {
        not: "NotVerified",
      };
    case "pending":
      return "NotVerified";
    default:
      return undefined;
  }
}

export const getCustomers: ApiHandler = async ({ req, res }) => {
  try {
    const query = req.query;

    const { verified } = customerRequestSchema.validateSync(query);

    const customers = await prisma.customer.findMany({
      where: {
        // @ts-ignore
        verificationLevel: getVerificationLevel(verified),
      },
    });

    // const { customerId } = req.query;
    //
    // const customer = await prisma.customer.findUnique({
    //   where: {
    //     cuid: customerId as string,
    //   },
    //   include: {
    //     blockchainAccounts: true,
    //     termsOfUse: {
    //       where: {
    //         termsOfUseId: Number(
    //           process.env.ACTIVE_TERMS_OF_USE_ID || ("1" as string)
    //         ),
    //       },
    //     },
    //   },
    // });
    //
    // if (!customer) {
    //   const { output } = notFound();
    //   return res.status(output.statusCode).json(output.payload);
    // }

    return res.status(200).json(customers);
  } catch (e: any) {
    throw e;
  }
};
