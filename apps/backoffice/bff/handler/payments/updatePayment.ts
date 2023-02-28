import { prisma } from "@axtp/db";
import { ApiHandler } from "@/bff/types/apiHandler";
import { notFound, badRequest } from "@hapi/boom";
import { mixed, object, string, ValidationError } from "yup";
import { asPaymentResponse } from "@/bff/handler/payments/asPaymentResponse";

const paymentRequestSchema = object({ txid: string() });

const paymentUpdateBodySchema = object({
  status: mixed().required().oneOf(["Processed", "Cancelled"]),
  recordId: string().required(),
  observation: string(),
});

export const updatePayment: ApiHandler = async ({ req, res }) => {
  try {
    const { txid } = paymentRequestSchema.validateSync(req.query);
    const { recordId, status, observation } =
      paymentUpdateBodySchema.validateSync(req.body);

    let data: any = {
      status,
      observation,
    };

    if (status === "Processed") {
      data.processedRecordId = recordId;
    }
    if (status === "Cancelled") {
      data.cancelRecordId = recordId;
    }

    const payment = await prisma.payment.update({
      where: { transactionId: txid },
      data,
      include: {
        customer: {
          select: {
            cuid: true,
          },
        },
      },
    });

    if (!payment) {
      throw notFound();
    }

    return res.status(200).json(asPaymentResponse(payment));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
