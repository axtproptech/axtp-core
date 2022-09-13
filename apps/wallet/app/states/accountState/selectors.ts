import { RootState } from "@/states/store";

export const selectCurrentPublicKey = (state: RootState): string =>
  state.accountState.publicKey;
export const selectSecuredAccountKeys = (state: RootState): string =>
  state.accountState.securedKeys;
