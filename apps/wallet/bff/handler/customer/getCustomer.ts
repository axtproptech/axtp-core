import { HandlerFunction } from "@/bff/route";
import { prisma } from "@axt/db-package";
import { internal, notFound } from "@hapi/boom";

export const getCustomer: HandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;

    const customer = prisma.customer.findUnique({
      where: {
        id: Number(customerId as string),
      },
      include: {
        blockchainAccounts: true,
      },
    });

    if (!customer) {
      const { output } = notFound();
      return res.status(output.statusCode).json(output.payload);
    }

    return res.status(200).json(customer);
  } catch (e: any) {
    console.error("Errored", e);
    const { output } = internal(e.message);
    res.status(output.statusCode).json(output.payload);
  }
};
