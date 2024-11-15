import { SignableDocument } from "@/types/signableDocument";
import { SigningQuerySchemaType } from "./signingQuerySchema";

export interface SigningFormData {
  document: SignableDocument | null;
  signed: boolean;
  queryParams: SigningQuerySchemaType | null;
}
