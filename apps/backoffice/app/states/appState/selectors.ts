import { RootState } from "@/states/store";
import { createSelector } from "@reduxjs/toolkit";
import { SnackBarState, ShareModalStatus } from "./slice";

export const selectThemeMode = (state: RootState): "dark" | "light" =>
  state.appState.themeMode;

export const selectIsDarkMode = createSelector(
  selectThemeMode,
  (mode) => mode === "dark"
);

export const selectIsOpenShareModal = (state: RootState): ShareModalStatus =>
  state.appState.isOpenShareModal;

export const selectIsOpenVerifyProfileModal = (state: RootState): boolean =>
  state.appState.isOpenVerifyProfileModal;

export const selectIsOpenWalletModal = (state: RootState): boolean =>
  state.appState.isOpenWalletModal;

export const selectIsOpenSignTransactionModal = (state: RootState): boolean =>
  state.appState.isOpenSignTransactionModal;

export const selectIsOpenWalletWrongNetworkModal = (
  state: RootState
): boolean => state.appState.isOpenWalletWrongNetworkModal;

export const selectSnackbarState = (state: RootState): SnackBarState =>
  state.appState.snackBar;

export const selectIsWalletConnected = (state: RootState): boolean =>
  state.appState.isWalletConnected;

export const selectNodeHost = (state: RootState): string =>
  state.appState.nodeHost;

export const selectIsLeftDrawerOpened = (state: RootState): boolean =>
  state.appState.isLeftDrawerOpened;
