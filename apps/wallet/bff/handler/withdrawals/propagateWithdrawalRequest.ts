import { RouteHandlerFunction } from "@/bff/route";
import { RequestWithdrawalRequest } from "@/bff/types/requestWithdrawalRequest";
import { handleError } from "@/bff/handler/handleError";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { sendWithdrawalRequestMails } from "./sendWithdrawalRequestedMails";
import { object, string } from "yup";

const bodySchema = object({
  currency: string().required(),
  customerId: string().required(),
  tokenId: string().required(),
  tokenName: string().required(),
  tokenQnt: string().required(),
  txId: string().required(),
});
export const propagateWithdrawalRequest: RouteHandlerFunction = async (
  req,
  res
) => {
  try {
    const request = bodySchema.validateSync(
      req.body
    ) as RequestWithdrawalRequest;

    await sendWithdrawalRequestMails(request);

    bffLoggingService.info({
      msg: "Withdrawal Request propagated",
      domain: "withdrawal",
      detail: req.body,
    });
    res.status(201).end();
  } catch (e) {
    handleError({ e, res });
  }
};
