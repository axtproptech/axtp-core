import { BlockchainAccountResponse } from "@/bff/types/blockchainAccountResponse";

interface CustomerData {
  cuid: string;
  cpfCnpj: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isBlocked: boolean;
  verificationLevel: string;
  blockchainAccounts: BlockchainAccountResponse[];
}

export interface PaymentFullResponse {
  id: number;
  createdAt: string;
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
  customer: CustomerData;
}
