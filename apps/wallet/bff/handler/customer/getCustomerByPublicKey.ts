import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axt/db-package";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";

export const getCustomerByPublicKey: HandlerFunction = async (req, res) => {
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
            termsOfUseId: Number(
              process.env.ACTIVE_TERMS_OF_USE_ID || ("1" as string)
            ),
          },
        },
      },
    });

    return res.status(200).json(customer);
  } catch (e: any) {
    handleError({ e, res });
  }
};
