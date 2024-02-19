import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BurnContractData } from "@/types/burnContractData";
import { TokenAccountCredits } from "@axtp/core";

// // FIXME: remove the mock
// const MockTACs: TokenAccountCredits[] = [
//   {
//     tokenId: "17364735717996724982",
//     accountCredits: [
//       {
//         accountId: "2402520554221019656",
//         creditQuantity: "1000",
//       },
//       {
//         accountId: "3744968806698214868",
//         creditQuantity: "20000",
//       },
//     ],
//   },
// ];
//
// const MockTT = {
//   "17364735717996724982": {
//     id: "17364735717996724982",
//     name: "TAXTC",
//     balance: "100000",
//     supply: "9500000",
//     decimals: 2,
//     numHolders: 20,
//   },
// };
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
