import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";

export const getPayment: ApiHandler = async ({ req, res }) => {
  try {
    const { txid } = req.query;
    const payment = await prisma.payment.findUnique({
      where: {
        transactionId: txid as string,
      },
      include: {
        customer: {
          include: {
            blockchainAccounts: true,
          },
        },
      },
    });
    if (!payment) {
      res.status(404).end();
    } else {
      res.status(200).json(payment);
    }
  } catch (e: any) {
    throw e;
  }
};
