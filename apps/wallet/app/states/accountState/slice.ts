import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  accountId: string;
  securedKeys: string;
}

const initialState: AccountState = {
  accountId: "",
  securedKeys: "",
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
      }>
    ) => {
      state.accountId = action.payload.accountId;
      state.securedKeys = action.payload.securedKeys;
    },
  },
});

export const { actions } = accountSlice;
