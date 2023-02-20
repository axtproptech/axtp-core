import { MarketService } from "@/app/services/marketService";
import useSWR from "swr";
import { useAppSelector } from "@/states/hooks";
import { selectTickerSymbol, marketActions } from "@/app/states/marketState";
import { useDispatch } from "react-redux";

const marketService = new MarketService();

const PollingInterval = 20 * 60 * 1000; // 20 Minutes

const swrPollingOptions = {
  dedupingInterval: PollingInterval - 1_000,
  refreshInterval: PollingInterval,
};

export const MarketInitializer = () => {
  const userTicker = useAppSelector(selectTickerSymbol);
  const dispatch = useDispatch();

  useSWR(
    `fetchMarketInformation?${userTicker}`,
    async () => {
      const market = await marketService.getSignaMarket(userTicker);
      if (market)
        dispatch(
          marketActions.updateMarketData({
            ticker: userTicker,
            ...market,
          })
        );
    },
    swrPollingOptions
  );

  useSWR(
    `fetchUsdBrlMarketInformation`,
    async () => {
      const market = await marketService.getUsdBrlMarket();
      if (market)
        dispatch(
          marketActions.updateMarketData({
            ticker: "brlUsd",
            ...market,
          })
        );
    },
    swrPollingOptions
  );

  return null;
};
