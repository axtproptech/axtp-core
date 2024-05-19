import { SignedDocumentType } from "@/types/signedDocumentType";

export interface SignedDocumentSafeData {
  documentHash: string;
  isExpired: boolean;
  type: SignedDocumentType;
  transactionId: string;
  poolId?: string;
}
