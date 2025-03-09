import { SignableDocumentType } from "@/types/signableDocumentType";

export interface SignedDocumentSafeData {
  documentHash: string;
  isExpired: boolean;
  type: SignableDocumentType;
  transactionId: string;
  poolId?: string;
}
