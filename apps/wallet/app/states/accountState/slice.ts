import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@signumjs/core";
import { CustomerSafeData } from "@/types/customerSafeData";

export interface AccountState {
  publicKey: string;
  accountId: string;
  customer?: CustomerSafeData;
  securedKeys: string;
  salt: string;
  showVerificationStatus: boolean;
}

const initialState: AccountState = {
  publicKey: "",
  accountId: "",
  securedKeys: "",
  salt: "",
  customer: undefined,
  showVerificationStatus: true,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (
      state,
      action: PayloadAction<{
        publicKey: string;
        securedKeys: string;
        salt: string;
      }>
    ) => {
      state.publicKey = action.payload.publicKey;
      state.accountId = Address.fromPublicKey(
        action.payload.publicKey
      ).getNumericId();
      state.securedKeys = action.payload.securedKeys;
      state.salt = action.payload.salt;
    },
    setCustomer: (state, action: PayloadAction<CustomerSafeData>) => {
      state.customer = { ...action.payload };
    },
    resetAccount: (_) => initialState,
    setShowVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.showVerificationStatus = action.payload;
    },
  },
});

export const { actions: accountActions } = accountSlice;
