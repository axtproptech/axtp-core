import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  accountId: string;
  securedKeys: string;
  salt: string;
}

const initialState: AccountState = {
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
        accountId: string;
        securedKeys: string;
        salt: string;
      }>
    ) => {
      state.accountId = action.payload.accountId;
      state.securedKeys = action.payload.securedKeys;
      state.salt = action.payload.salt;
    },
  },
});

export const { actions: accountActions } = accountSlice;
