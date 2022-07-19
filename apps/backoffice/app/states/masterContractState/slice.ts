import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ApprovalStatus,
  MasterContractData,
  TokenInfo,
} from "@/types/masterContractData";

const DefaultApprovalStatus: ApprovalStatus = {
  approvedAccounts: [],
  quantity: "0",
};

const DefaultTokenData: TokenInfo = {
  name: "",
  id: "",
  quantity: "0",
  supply: "0",
};

export interface MasterContractState {
  masterContract: MasterContractData;
}

const initialState: MasterContractState = {
  masterContract: {
    balance: "0",
    approvalStatusBurning: DefaultApprovalStatus,
    approvalStatusMinting: DefaultApprovalStatus,
    approvalStatusSendToPool: DefaultApprovalStatus,
    currentSendPoolAddress: "",
    token: DefaultTokenData,
    transactions: [],
  },
};

export const masterContractSlice = createSlice({
  name: "masterContract",
  initialState,
  reducers: {
    setMasterContractData: (
      state,
      action: PayloadAction<MasterContractData>
    ) => {
      state.masterContract = action.payload;
    },
  },
});

export const { actions } = masterContractSlice;
