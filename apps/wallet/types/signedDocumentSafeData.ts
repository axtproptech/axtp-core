export interface SignedDocumentSafeData {
  documentHash: string;
  isExpired: boolean;
  type: string;
  transactionId: string;
}
