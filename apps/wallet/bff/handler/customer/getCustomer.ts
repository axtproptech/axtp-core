import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";
import { toCustomerResponse } from "@/bff/handler/customer/toCustomerResponse";

export const getCustomer: HandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;

    const customer = await prisma.customer.findUnique({
      where: {
        cuid: customerId as string,
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

    if (!customer) {
      const { output } = notFound();
      return res.status(output.statusCode).json(output.payload);
    }
    return res.status(200).json(toCustomerResponse(customer));
  } catch (e: any) {
    handleError({ e, res });
  }
};
