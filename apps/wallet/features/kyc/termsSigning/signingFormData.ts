import { SignableDocument } from "@/features/kyc/types/signableDocument";
import { SigningQuerySchemaType } from "./signingQuerySchema";

export interface SigningFormData {
  document: SignableDocument | null;
  signed: boolean;
  queryParams: SigningQuerySchemaType | null;
}
