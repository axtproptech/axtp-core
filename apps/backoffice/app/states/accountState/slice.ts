import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionRole } from "@/types/permissionRole";

export interface AccountState {
  publicKey: string;
  rememberWalletConnection: boolean;
  role: PermissionRole;
}

const initialState: AccountState = {
  publicKey: "",
  rememberWalletConnection: false,
  role: "",
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    setRememberWalletConnection: (state, action: PayloadAction<boolean>) => {
      state.rememberWalletConnection = action.payload;
    },
    reset: () => initialState,
  },
});

export const { actions } = accountSlice;
