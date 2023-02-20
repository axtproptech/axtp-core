import { RouteHandlerFunction } from "@/bff/route";

export const getPaymentStatus: RouteHandlerFunction = async (req, res) => {
  const { txId } = req.query;

  // we get the payment status from our database
  // pagseguro is returning their status via webhook, i.e. calling /public/pix/pagseg
  // TODO get status from charge - pagseguro

  res.status(200).json({
    status: "pending",
  });
};
