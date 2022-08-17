import { RootState } from "@/states/store";

export const selectCurrentAccountId = (state: RootState): string =>
  state.accountState.accountId;
export const selectSecuredAccountKeys = (state: RootState): string =>
  state.accountState.securedKeys;
