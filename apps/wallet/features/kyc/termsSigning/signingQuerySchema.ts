import { InferType, mixed, object, string } from "yup";
import { SignableDocumentType } from "@/types/signableDocumentType";

export const SigningQuerySchema = object({
  reason: string().required(),
  type: mixed().oneOf(Object.values(SignableDocumentType)).required(),
  redirect: string().required(),
  poolId: string().optional(),
});

export type SigningQuerySchemaType = InferType<typeof SigningQuerySchema>;
