import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApprovalStatus, MasterContractData } from "@/types/masterContractData";

const DefaultApprovalStatus: ApprovalStatus = {
  approvedAccounts: [],
  quantity: "",
};

export interface MasterContractState {
  masterContract: MasterContractData;
  isInitializing: boolean;
}

const initialState: MasterContractState = {
  masterContract: {
    balance: "0",
    approvalStatusBurning: DefaultApprovalStatus,
    approvalStatusMinting: DefaultApprovalStatus,
    approvalStatusSendToPool: DefaultApprovalStatus,
    currentSendPoolAddress: "",
    tokenId: "",
  },
  isInitializing: true,
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
      state.isInitializing = false;
    },
  },
});

export const { actions } = masterContractSlice;
