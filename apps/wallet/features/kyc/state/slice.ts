import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  InitialStep,
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
} from "@/app/types/kycData";
import { Steps } from "../types/steps";

export interface KycState {
  currentStep: Steps;
  agreeTerms: boolean;
  initialStep: InitialStep;
  secondStep: SecondStep;
  thirdStep: ThirdStep;
  fourthStep: FourthStep;
  motherDataStep: MotherDataStep;
  documentStep: DocumentStep;
}

export const initialState: KycState = {
  currentStep: Steps.AgreeTerms,
  agreeTerms: false,
  initialStep: { firstName: "", lastName: "", email: "", code: "" },
  secondStep: { cpf: "", birthDate: "", birthPlace: "" },
  thirdStep: { phone: "", profession: "" },
  fourthStep: {
    streetAddress: "",
    complementaryStreetAddress: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    proofOfAddress: "",
  },
  motherDataStep: { firstName: "", lastName: "" },
  documentStep: { documentType: "cnh", frontSide: "", backSide: "" },
};

export const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    reset: () => initialState,
    setCurrentStep: (state, action: PayloadAction<Steps>) => {
      state.currentStep = action.payload;
    },
    setAgreeTerms: (state, action: PayloadAction<boolean>) => {
      state.agreeTerms = action.payload;
    },
    setInitialStep: (state, action: PayloadAction<InitialStep>) => {
      state.initialStep = action.payload;
    },
    setSecondStep: (state, action: PayloadAction<SecondStep>) => {
      state.secondStep = action.payload;
    },
    setThirdStep: (state, action: PayloadAction<ThirdStep>) => {
      state.thirdStep = action.payload;
    },
    setFourthStep: (state, action: PayloadAction<FourthStep>) => {
      state.fourthStep = action.payload;
    },
    setMotherDataStep: (state, action: PayloadAction<MotherDataStep>) => {
      state.motherDataStep = action.payload;
    },
    setDocumentStep: (state, action: PayloadAction<DocumentStep>) => {
      state.documentStep = action.payload;
    },
  },
});

export const { actions: kycActions } = kycSlice;
