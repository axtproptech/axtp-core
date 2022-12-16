import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";
import { toSafeCustomerResponse } from "@/bff/handler/customer/toSafeCustomerResponse";

export const getCustomerByPublicKey: RouteHandlerFunction = async (
  req,
  res
) => {
  try {
    const { publicKey } = req.query;

    const account = await prisma.blockchainAccount.findUnique({
      where: {
        publicKey: publicKey as string,
      },
      include: {
        customer: true,
      },
    });

    if (!account) {
      const { output } = notFound();
      return res.status(output.statusCode).json(output.payload);
    }

    const customer = await prisma.customer.findUnique({
      where: {
        cuid: account.customer.cuid,
      },
      include: {
        blockchainAccounts: true,
        termsOfUse: {
          where: {
            termsOfUseId: Number(process.env.ACTIVE_TERMS_OF_USE_ID || "1"),
          },
        },
      },
    });

    return res.status(200).json(toSafeCustomerResponse(customer));
  } catch (e: any) {
    handleError({ e, res });
  }
};
