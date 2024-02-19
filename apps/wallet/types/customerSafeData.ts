import { VerificationLevelType } from "./verificationLevelType";

export interface CustomerSafeData {
  customerId: string;
  acceptedTerms: boolean;
  verificationLevel: VerificationLevelType;
  isActive: boolean;
  isBlocked: boolean;
  firstName: string;
  publicKey: string;
  hasBankInformation: boolean;
}
