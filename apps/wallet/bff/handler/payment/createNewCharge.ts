import { HandlerFunction } from "@/bff/route";
import { sha256 } from "@/bff/sha256";

const TestPayload =
  "00020126830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/210387E0-A6BF-45D1-80B5-CFEB9BBCEE2F5204899953039865802BR5921Pagseguro Internet SA6009SAO PAULO62070503***63047E6D";

export const createNewCharge: HandlerFunction = async (req, res) => {
  const { customerId, accountId, poolId, quantity, amountBrl } = req.body;
  const txId = sha256(
    `${customerId}.${accountId}.${poolId}.${quantity}.${amountBrl}`
  );

  // TODO create charge - pagseguro

  res.status(200).json({
    txId,
    pixUrl: TestPayload,
  });
};
