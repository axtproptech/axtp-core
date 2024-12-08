import { SignableDocumentType } from "@/types/signableDocumentType";

export interface SignableDocument {
  documentHash: string;
  url: string;
  text: string;
  type: SignableDocumentType;
}
