import { RootState } from "@/states/store";
import { BurnContractData } from "@/types/burnContractData";

export const selectBurnContractState = (state: RootState): BurnContractData =>
  state.burnContractState.burnContract;
