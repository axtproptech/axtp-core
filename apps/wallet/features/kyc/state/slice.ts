import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  InitialStep,
  SecondStep,
  ThirdStep,
  FourthStep,
  MotherDataStep,
  DocumentStep,
  BlockchainAccountStep,
} from "@/app/types/kycData";

export interface KycState {
  agreeTerms: boolean;
  initialStep: InitialStep;
  secondStep: SecondStep;
  thirdStep: ThirdStep;
  fourthStep: FourthStep;
  motherDataStep: MotherDataStep;
  documentStep: DocumentStep;
  blockchainAccountStep: BlockchainAccountStep;
}

export const initialState: KycState = {
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
  blockchainAccountStep: {
    accountId: "",
    agreeTerms: false,
  },
};

export const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    reset: () => initialState,
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
    setBlockchainAccountStep: (
      state,
      action: PayloadAction<BlockchainAccountStep>
    ) => {
      state.blockchainAccountStep = action.payload;
    },
  },
});

export const { actions: kycActions } = kycSlice;
