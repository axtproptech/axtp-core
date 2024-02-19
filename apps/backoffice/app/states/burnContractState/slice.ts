import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BurnContractData } from "@/types/burnContractData";
import { TokenAccountCredits } from "@axtp/core";

export interface BurnContractState {
  burnContract: BurnContractData;
}

const initialState: BurnContractState = {
  burnContract: {
    id: "",
    balanceSigna: "0",
    creditorAccountIds: [],
    trackableTokens: {},
    tokenAccountCredits: [],
  },
};

export const burnContractSlice = createSlice({
  name: "burnContract",
  initialState,
  reducers: {
    setBurnContractData: (state, action: PayloadAction<BurnContractData>) => {
      state.burnContract = {
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { actions } = burnContractSlice;
