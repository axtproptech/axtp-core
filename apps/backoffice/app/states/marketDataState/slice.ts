import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarketData } from "@axtp/core/markets/fiatTickerService";
export interface MarketDataState {
  usdBrl: MarketData;
}

const initialState: MarketDataState = {
  usdBrl: {
    current_price: 0,
    last_updated: "",
    high_24h: 0,
    low_24h: 0,
    price_change_percentage_24h: 0,
  },
};

export const marketDataSlice = createSlice({
  name: "marketData",
  initialState,
  reducers: {
    setUsdBrlMarketData: (state, action: PayloadAction<MarketData>) => {
      state.usdBrl = action.payload;
    },
  },
});

export const { actions } = marketDataSlice;
