import { RootState } from "@/states/store";
import {
  InitialSetupStep,
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
} from "@/app/types/kycData";
import { Steps } from "../types/steps";

export const selectCurrentStep = (state: RootState): Steps =>
  state.kycState.step;

export const selectAgreeTerms = (state: RootState): boolean =>
  state.kycState.agreeTerms;

export const selectInitialSetupStep = (state: RootState): InitialSetupStep =>
  state.kycState.initialSetupStep;

export const selectSecondStep = (state: RootState): SecondStep =>
  state.kycState.secondStep;

export const selectThirdStep = (state: RootState): ThirdStep =>
  state.kycState.thirdStep;

export const selectFourthStep = (state: RootState): FourthStep =>
  state.kycState.fourthStep;

export const selectMotherDataStep = (state: RootState): MotherDataStep =>
  state.kycState.motherDataStep;

export const selectDocumentStep = (state: RootState): DocumentStep =>
  state.kycState.documentStep;
