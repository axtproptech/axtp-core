import { HandlerFunction } from "@/bff/route";
import { createLedgerClient } from "@/bff/createLedgerClient";
import { PaymentRecordService } from "@axtp/core";
import { Amount } from "@signumjs/util";
import { PaymentRecord } from "@axtp/core/paymentRecord";
import { getEnvVar } from "@/bff/getEnvVar";
import { Address } from "@signumjs/core";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";

export const registerPaymentRecord: HandlerFunction = async (req, res) => {
  const {
    customerId,
    accountPk,
    poolId,
    tokenId,
    tokenQnt,
    amount,
    paymentType,
    txId,
  } = req.body as RegisterPaymentRequest;

  const ledger = createLedgerClient();

  const senderSeed = getEnvVar("NEXT_SERVER_PRINCIPAL_SIGNUM_ACCOUNT_SECRET");
  const paymentRecordAccountPubKey = getEnvVar(
    "NEXT_SERVER_PAYMENT_SIGNUM_ACCOUNT_PUBKEY"
  );

  const service = new PaymentRecordService({
    ledger,
    senderSeed,
    sendFee: Amount.fromSigna(0.01),
  });

  const record = PaymentRecord.create({
    accountId: Address.fromPublicKey(accountPk).getNumericId(),
    poolId,
    tokenId,
    tokenQuantity: tokenQnt,
    paymentAmount: amount,
    paymentTransactionId: txId,
    paymentType,
    customerId,
  });

  const [recordTx] = await Promise.all([
    service.sendPaymentRecord(record, paymentRecordAccountPubKey),
    service.sendPaymentReceiptToCustomer(record, accountPk),
  ]);

  res.status(201).json(recordTx);
};
