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

export const selectAgreeTerms = (state: RootState): boolean =>
  state.kycState.agreeTerms;
