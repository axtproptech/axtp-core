import { InferType, mixed, object, string } from "yup";
import { SignedDocumentType } from "@/types/signedDocumentType";

export const SigningQuerySchema = object({
  reason: string().required(),
  type: mixed().oneOf(Object.values(SignedDocumentType)).required(),
  redirect: string().required(),
  poolId: string().optional(),
});

export type SigningQuerySchemaType = InferType<typeof SigningQuerySchema>;
