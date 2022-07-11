import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSystemTheme } from "@/app/getSystemTheme";

export interface SnackBarState {
  label: string;
  severity: "" | "error" | "warning" | "info" | "success";
}

export type ShareModalStatus = "site" | "NFT" | "collection" | "profile" | "";

export interface AppState {
  themeMode: "light" | "dark";
  isOpenWalletModal: boolean;
  isOpenWalletWrongNetworkModal: boolean;
  isOpenSignTransactionModal: boolean;
  snackBar: SnackBarState;
  nodeHost: string;
  isWalletConnected: boolean;
}

const initialState: AppState = {
  themeMode: getSystemTheme(),
  isOpenWalletModal: false,
  isOpenWalletWrongNetworkModal: false,
  isOpenSignTransactionModal: false,
  snackBar: { label: "", severity: "" },
  nodeHost: "",
  isWalletConnected: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.themeMode = action.payload;
    },
    setWalletModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenWalletModal = action.payload;
    },
    setWalletWrongNetworkModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenWalletWrongNetworkModal = action.payload;
    },
    setSignTransactionModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenSignTransactionModal = action.payload;
    },
    setSnackbar: (state, action: PayloadAction<SnackBarState>) => {
      state.snackBar = action.payload;
    },
    setNodeHost: (state, action: PayloadAction<string>) => {
      state.nodeHost = action.payload;
    },
    setIsWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isWalletConnected = action.payload;
    },
  },
});

export const { actions } = appSlice;
