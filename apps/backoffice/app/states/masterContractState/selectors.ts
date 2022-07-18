import { RootState } from "@/states/store";
import { MasterContractData } from "@/types/masterContractData";

export const selectMasterContractState = (
  state: RootState
): MasterContractData => state.masterContractState.masterContract;

export const selectIsInitializingMasterContractState = (
  state: RootState
): boolean => state.masterContractState.isInitializing;
