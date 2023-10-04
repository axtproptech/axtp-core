import { RootState } from "@/states/store";
import {
  InitialStep,
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
  BlockchainAccountStep,
} from "@/app/types/kycData";
import { Steps } from "../types/steps";

export const selectCurrentStep = (state: RootState): Steps =>
  state.kycState.currentStep;

export const selectAgreeTerms = (state: RootState): boolean =>
  state.kycState.agreeTerms;
