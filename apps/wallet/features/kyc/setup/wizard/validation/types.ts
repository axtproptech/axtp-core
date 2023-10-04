import {
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
  BlockchainAccountStep,
} from "@/app/types/kycData";

export interface KycWizard
  extends SecondStep,
    ThirdStep,
    FourthStep,
    MotherDataStep,
    DocumentStep,
    BlockchainAccountStep {
  agreeTerms: boolean;
}
