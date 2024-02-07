import { RootState } from "@/states/store";
import { createSelector } from "@reduxjs/toolkit";
import { BurnContractData } from "@/types/burnContractData";

export const selectBurnContractState = (state: RootState): BurnContractData =>
  state.burnContractState;

// export const selectMasterTokenInfo = createSelector(
//   selectMasterContractState,
//   (state) => state.token
// );
