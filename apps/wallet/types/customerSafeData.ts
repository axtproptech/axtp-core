import { VerificationLevelType } from "./verificationLevelType";
import { SignedDocumentSafeData } from "./signedDocumentSafeData";

export interface CustomerSafeData {
  customerId: string;
  signedDocuments: SignedDocumentSafeData[];
  verificationLevel: VerificationLevelType;
  isActive: boolean;
  isBlocked: boolean;
  firstName: string;
  publicKey: string;
  hasBankInformation: boolean;
}
