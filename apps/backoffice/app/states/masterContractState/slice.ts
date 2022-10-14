import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MasterContractData } from "@/types/masterContractData";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { ApprovalStatus } from "@/types/approvalStatus";

const DefaultApprovalStatus: ApprovalStatus = {
  approvedAccounts: [],
  quantity: "0",
};

const DefaultTokenData: BasicTokenInfo = {
  name: "",
  id: "",
  balance: "0",
  supply: "0",
};

export interface MasterContractState {
  masterContract: MasterContractData;
}

const initialState: MasterContractState = {
  masterContract: {
    id: "",
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
