import {
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
} from "@/app/types/kycData";

interface BlockchainAccountStep {
  devicePin: string;
  accountPublicKey: string;
  accountSeedPhrase: string;
  agreeSafetyTerms: boolean;
  seedPhraseVerification: string;
  seedPhraseVerificationIndex: number;
}

export interface KycWizard
  extends SecondStep,
    ThirdStep,
    FourthStep,
    MotherDataStep,
    DocumentStep,
    BlockchainAccountStep {
  agreeTerms: boolean;
}
