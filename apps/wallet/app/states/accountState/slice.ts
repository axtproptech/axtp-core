import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@signumjs/core";

export interface AccountState {
  publicKey: string;
  accountId: string;
  securedKeys: string;
  salt: string;
}

const initialState: AccountState = {
  publicKey: "",
  accountId: "",
  securedKeys: "",
  salt: "",
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
    resetAccount: (_) => initialState,
  },
});

export const { actions: accountActions } = accountSlice;
