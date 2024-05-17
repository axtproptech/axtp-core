import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  InitialSetupStep,
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
} from "@/app/types/kycData";
import { Steps } from "../types/steps";

export interface KycState {
  step: Steps;
  initialSetupStep: InitialSetupStep;
  agreeTerms: boolean;
  secondStep: SecondStep;
  thirdStep: ThirdStep;
  fourthStep: FourthStep;
  motherDataStep: MotherDataStep;
  documentStep: DocumentStep;
}

export const initialState: KycState = {
  step: Steps.AgreeTerms,
  initialSetupStep: { firstName: "", lastName: "", email: "", code: "" },
  agreeTerms: false,
  secondStep: { cpf: "", birthDate: "", birthPlace: "" },
  thirdStep: { phone: "", profession: "", pep: false },
  fourthStep: {
    streetAddress: "",
    complementaryStreetAddress: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    proofOfAddress: "",
  },
  motherDataStep: { firstNameMother: "", lastNameMother: "" },
  documentStep: { documentType: "cnh", frontSide: "", backSide: "" },
};

export const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    reset: () => initialState,
    setCurrentStep: (state, action: PayloadAction<Steps>) => {
      state.step = action.payload;
    },
    setAgreeTerms: (state, action: PayloadAction<boolean>) => {
      state.agreeTerms = action.payload;
    },
    setInitialSetupStep: (state, action: PayloadAction<InitialSetupStep>) => {
      state.initialSetupStep = action.payload;
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
