import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { notFound } from "@hapi/boom";
import { handleError } from "@/bff/handler/handleError";
import { toSafeCustomerResponse } from "@/bff/handler/customer/toSafeCustomerResponse";

export const getCustomer: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;

    const customer = await prisma.customer.findUnique({
      where: {
        cuid: customerId as string,
      },
      include: {
        blockchainAccounts: true,
        bankInformation: true,
        signedDocuments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!customer || customer.isBlocked) {
      const { output } = notFound();
      return res.status(output.statusCode).json(output.payload);
    }
    return res.status(200).json(toSafeCustomerResponse(customer));
  } catch (e: any) {
    handleError({ e, res });
  }
};
