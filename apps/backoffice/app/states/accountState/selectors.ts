import { RootState } from "@/states/store";

export const selectRememberWalletConnection = (state: RootState): boolean =>
  state.accountState.rememberWalletConnection;

export const selectIsTermAccepted = (state: RootState): boolean =>
  state.accountState.isTermAccepted;
