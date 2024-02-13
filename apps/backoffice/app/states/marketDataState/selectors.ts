import { RootState } from "@/states/store";
import { MarketData } from "@axtp/core/markets/fiatTickerService";

export const selectUsdBrlMarketState = (state: RootState): MarketData =>
  state.marketDataState.usdBrl;
