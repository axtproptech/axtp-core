import { RootState } from "@/states/store";
import { TokenData } from "@/types/tokenData";

export const selectAXTToken = (state: RootState): TokenData =>
  state.tokenState.axt;
export const selectAllPoolTokens = (state: RootState): TokenData[] =>
  Object.values(state.tokenState.poolTokens);
export const selectPoolToken =
  (poolTokenId: string) =>
  (state: RootState): TokenData | undefined =>
    state.tokenState.poolTokens[poolTokenId];
