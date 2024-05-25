import { SignedDocumentType } from "@/types/signedDocumentType";

export interface SignableDocument {
  documentHash: string;
  url: string;
  hasRead: boolean;
  type: SignedDocumentType;
}
