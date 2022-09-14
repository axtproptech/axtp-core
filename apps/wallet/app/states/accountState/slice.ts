import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@signumjs/core";
import { VerificationLevelType } from "@/types/verificationLevelType";

export interface CustomerState {
  customerId: string;
  firstName: string;
  verificationLevel: VerificationLevelType;
  acceptedTerms: boolean;
}

export interface AccountState {
  publicKey: string;
  accountId: string;
  customer?: CustomerState;
  securedKeys: string;
  salt: string;
}

const initialState: AccountState = {
  publicKey: "",
  accountId: "",
  securedKeys: "",
  salt: "",
  customer: undefined,
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
    setCustomer: (state, action: PayloadAction<CustomerState>) => {
      state.customer = { ...action.payload };
    },
    resetAccount: (_) => initialState,
  },
});

export const { actions: accountActions } = accountSlice;
