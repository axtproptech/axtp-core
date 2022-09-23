import { prisma } from "@axt/db-package";
import { ApiHandler } from "@/bff/types/apiHandler";

export const getCustomers: ApiHandler = async ({ req, res }) => {
  try {
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

    return res.status(200).json({ test: "ok" });
  } catch (e: any) {
    throw e;
  }
};
