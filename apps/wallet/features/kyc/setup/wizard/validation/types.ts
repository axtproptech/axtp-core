import {
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
} from "@/app/types/kycData";

type BlockchainAccountStep = {
  accountId: string;
  accountSeedPhrase: string;
  agreeSafetyTerms: boolean;
  seedPhraseVerification: string;
  seedPhraseVerificationIndex: number;
};

export interface KycWizard
  extends SecondStep,
    ThirdStep,
    FourthStep,
    MotherDataStep,
    DocumentStep,
    BlockchainAccountStep {
  agreeTerms: boolean;
}
