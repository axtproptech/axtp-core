export interface PaymentResponse {
  id: number;
  createdAt: string;
  cuid: string;
  updatedAt: string;
  accountId: string;
  type: string;
  amount: string;
  usd: string;
  currency: string;
  poolId: string;
  tokenId: string;
  tokenQuantity: number;
  transactionId: string;

  status: string;
  recordId: string;
  processedRecordId?: string;
  cancelRecordId?: string;

  cancelTransactionId?: string;
  observations?: string;
}
