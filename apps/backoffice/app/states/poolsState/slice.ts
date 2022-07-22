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
    setPoolData: (state, action: PayloadAction<PoolStateMap>) => {
      state.pools = action.payload;
    },
  },
});

export const { actions } = poolsSlice;
