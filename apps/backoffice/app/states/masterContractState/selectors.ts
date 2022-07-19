import { RootState } from "@/states/store";
import { createSelector } from "@reduxjs/toolkit";
import { MasterContractData } from "@/types/masterContractData";

export const selectMasterContractState = (
  state: RootState
): MasterContractData => state.masterContractState.masterContract;

export const selectMasterTokenInfo = createSelector(
  selectMasterContractState,
  (state) => state.token
);

export const selectIsInitializingMasterContractState = createSelector(
  selectMasterContractState,
  (state) => !state.token.name
);
