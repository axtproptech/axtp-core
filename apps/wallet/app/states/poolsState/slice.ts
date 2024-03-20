import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PoolContractData } from "@/types/poolContractData";

interface PoolStateMap {
  [key: string]: PoolContractData;
}

export interface PoolState {
  pools: PoolStateMap;
}

const initialState: PoolState = {
  pools: {},
};

export const poolsSlice = createSlice({
  name: "pools",
  initialState,
  reducers: {
    setPoolData: (state, action: PayloadAction<PoolContractData>) => {
      const poolData = action.payload;
      state.pools[poolData.poolId] = poolData;
    },
    reset: () => initialState,
  },
});

export const { actions: poolActions } = poolsSlice;
