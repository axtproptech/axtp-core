export interface CreateUploadUrlRequest {
  contentType: string;
  documentCategory: "kyc" | "signed-document";
}
