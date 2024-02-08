import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BurnContractData } from "@/types/burnContractData";
import { TokenAccountCredits } from "@axtp/core";

// FIXME: remove the mock
export const MockTACs: TokenAccountCredits[] = [
  {
    tokenInfo: {
      id: "5001",
      name: "MOCK1",
      balance: "100",
      supply: "150",
      decimals: 2,
      numHolders: 20,
    },
    accountCredits: [
      {
        accountId: "100001",
        creditQuantity: "10",
      },
      {
        accountId: "100002",
        creditQuantity: "10",
      },
    ],
  },
  {
    tokenInfo: {
      id: "5002",
      name: "MOCK2",
      balance: "100",
      supply: "100",
      decimals: 2,
      numHolders: 10,
    },
    accountCredits: [
      {
        accountId: "100001",
        creditQuantity: "10",
      },
    ],
  },
];

export interface BurnContractState {
  burnContract: BurnContractData;
}

const initialState: BurnContractState = {
  burnContract: {
    id: "",
    balanceSigna: "0",
    creditorAccountIds: [],
    trackableTokens: [],
    tokenAccountCredits: [],
  },
};

export const burnContractSlice = createSlice({
  name: "burnContract",
  initialState,
  reducers: {
    setBurnContractData: (state, action: PayloadAction<BurnContractData>) => {
      // FIXME: remove the mock
      state.burnContract = {
        ...action.payload,
        tokenAccountCredits: MockTACs,
      };
    },
    reset: () => initialState,
  },
});

export const { actions } = burnContractSlice;
