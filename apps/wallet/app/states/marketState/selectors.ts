import { RootState } from "@/states/store";
import { MarketData } from "@/types/marketData";
import { TickerSymbol } from "@/types/tickerSymbol";

export const selectTickerSymbol = (state: RootState): TickerSymbol =>
  state.marketState.selectedTickerSymbol;

export const selectMarketData =
  (ticker: TickerSymbol) =>
  (state: RootState): MarketData | null =>
    state.marketState.markets[ticker] || null;

export const selectActiveMarketData = (
  state: RootState
): MarketData & { ticker: string } => {
  const ticker = selectTickerSymbol(state);
  return {
    ticker,
    ...state.marketState.markets[ticker],
  };
};

export const selectBrlUsdMarketData = (
  state: RootState
): MarketData & { ticker: string } => {
  const ticker = "brlUsd";
  return {
    ticker,
    ...state.marketState.markets[ticker],
  };
};
