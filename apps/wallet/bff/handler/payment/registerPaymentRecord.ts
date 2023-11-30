import { RouteHandlerFunction } from "@/bff/route";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { handleError } from "@/bff/handler/handleError";
import { recordPayment } from "@/bff/handler/payment/recordPayment";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { sendPaymentRegistrationMails } from "./sendPaymentRegistrationMails";
import { object, string } from "yup";

const bodySchema = object({
  customerId: string().required(),
  accountPk: string().required(),
  poolId: string().required(),
  tokenId: string().required(),
  tokenQnt: string().required(),
  tokenName: string().required(),
  amount: string().required(),
  paymentType: string()
    .oneOf(["pix", "usdeth", "usdsol", "usdalg", "usdmat"])
    .required(),
  txId: string().optional(),
  usd: string().required(),
  currency: string().required(),
});
export const registerPaymentRecord: RouteHandlerFunction = async (req, res) => {
  try {
    const params = bodySchema.validateSync(req.body) as RegisterPaymentRequest;
    const recordTx = await recordPayment(params);

    await sendPaymentRegistrationMails({ ...params, recordTx });

    bffLoggingService.info({
      msg: "Payment recorded",
      domain: "payment",
      detail: req.body,
    });
    res.status(201).json(recordTx);
  } catch (e) {
    handleError({ e, res });
  }
};
