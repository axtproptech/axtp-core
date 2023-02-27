import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";

import { object, mixed, ValidationError } from "yup";
import { PaymentStatus } from "@/types/paymentStatus";
import { asPaymentResponse } from "@/bff/handler/payments/asPaymentResponse";

const status = () =>
  mixed()
    .oneOf(["all", "pending", "processed", "cancelled", "received"])
    .optional()
    .default("all");

const paymentRequestSchema = object({
  status: status(),
});

function asDatabaseStatus(status: PaymentStatus): any {
  if (status === "all") return undefined;
  return status[0].toUpperCase() + status.substring(1);
}

export const getPayments: ApiHandler = async ({ req, res }) => {
  try {
    const query = req.query;
    const { status } = paymentRequestSchema.validateSync(query);

    const payments = await prisma.payment.findMany({
      where: {
        status: asDatabaseStatus(status),
      },
      include: {
        customer: {
          select: {
            cuid: true,
          },
        },
      },
    });
    res.status(200).json(payments.map(asPaymentResponse));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
