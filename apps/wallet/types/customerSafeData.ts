import { VerificationLevelType } from "./verificationLevelType";

export interface CustomerSafeData {
  customerId: string;
  acceptedTerms: boolean;
  verificationLevel: VerificationLevelType;
  firstName: string;
}
