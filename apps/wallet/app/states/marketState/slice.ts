import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TickerSymbol } from "@/types/tickerSymbol";
import { MarketData } from "@/types/marketData";

export type MarketDataMap = {
  [ticker: string]: MarketData;
};

export interface MarketState {
  selectedTickerSymbol: TickerSymbol;
  markets: MarketDataMap;
}

const initialState: MarketState = {
  selectedTickerSymbol: "brl",
  markets: {},
};

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    updateMarketData: (
      state,
      action: PayloadAction<MarketData & { ticker: string }>
    ) => {
      const { ticker } = action.payload;
      state.markets[ticker] = action.payload;
    },
    setSelectedTickerSymbol: (state, action: PayloadAction<TickerSymbol>) => {
      state.selectedTickerSymbol = action.payload;
    },
  },
});

export const { actions: marketActions } = marketSlice;
