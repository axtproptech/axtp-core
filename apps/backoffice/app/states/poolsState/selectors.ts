import { RootState } from "@/states/store";
import { PoolContractData } from "@/types/poolContractData";

export const selectPoolContractState =
  (poolId: string) =>
  (state: RootState): PoolContractData =>
    state.poolsState.pools[poolId] || null;

export const selectAllPools = (state: RootState): PoolContractData[] =>
  Object.values(state.poolsState.pools);
