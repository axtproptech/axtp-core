import { RouteHandlerFunction } from "@/bff/route";
import { prisma } from "@axtp/db";
import { handleError } from "@/bff/handler/handleError";

export const getCustomerPayments: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;

    const payments = await prisma.payment.findMany({
      where: {
        customer: {
          cuid: customerId as string,
        },
      },
    });

    return res.status(200).json(
      payments.map((p) => {
        // @ts-ignore
        delete p.id;
        return p;
      })
    );
  } catch (e: any) {
    handleError({ e, res });
  }
};
