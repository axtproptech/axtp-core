import { RouteHandlerFunction } from "@/bff/route";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { handleError } from "@/bff/handler/handleError";
import { recordPayment } from "@/bff/handler/payment/recordPayment";
import { bffLoggingService } from "@/bff/bffLoggingService";

export const registerPaymentRecord: RouteHandlerFunction = async (req, res) => {
  try {
    const transactionId = await recordPayment(
      req.body as RegisterPaymentRequest
    );
    bffLoggingService.info({
      msg: "Payment recorded",
      domain: "payment",
      detail: req.body,
    });
    res.status(201).json(transactionId);
  } catch (e) {
    handleError({ e, res });
  }
};
