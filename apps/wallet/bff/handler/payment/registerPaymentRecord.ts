import { RouteHandlerFunction } from "@/bff/route";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { handleError } from "@/bff/handler/handleError";
import { recordPayment } from "@/bff/handler/payment/recordPayment";

export const registerPaymentRecord: RouteHandlerFunction = async (req, res) => {
  try {
    const transactionId = await recordPayment(
      req.body as RegisterPaymentRequest
    );
    res.status(201).json(transactionId);
  } catch (e) {
    handleError({ e, res });
  }
};
