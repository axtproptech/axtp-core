import { ApiHandler } from "@/bff/types/apiHandler";
import { mixed, number, object, string, ValidationError } from "yup";
import { asPaymentResponse } from "@/bff/handler/payments/asPaymentResponse";
import { processPayment } from "@/bff/handler/payments/updatePayment/processPayment";
import { cancelPayment } from "@/bff/handler/payments/updatePayment/cancelPayment";
import { notFound, badRequest } from "@hapi/boom";
import { registerTransactionId } from "@/bff/handler/payments/updatePayment/registerTransactionId";

const paymentRequestSchema = object({ id: number() });

const paymentUpdateBodySchema = object({
  status: mixed().required().oneOf(["Pending", "Processed", "Cancelled"]),
  transactionId: string().required(),
  observations: string(),
});

export const updatePayment: ApiHandler = async ({ req, res }) => {
  try {
    const { id } = paymentRequestSchema.validateSync(req.query);
    const { status } = paymentUpdateBodySchema.validateSync(req.body);

    let payment;
    switch (status) {
      case "Processed":
        payment = await processPayment(id, req.body);
        break;
      case "Cancelled":
        payment = await cancelPayment(id, req.body);
        break;
      case "Pending":
        payment = await registerTransactionId(id, req.body);
    }

    if (!payment) {
      throw notFound(`Payment [${id}] not found`);
    }
    res.status(200).json(asPaymentResponse(payment));
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
