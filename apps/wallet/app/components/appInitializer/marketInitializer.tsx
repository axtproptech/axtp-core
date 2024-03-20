import { MarketService } from "@/app/services/marketService";
import useSWR from "swr";
import { marketActions } from "@/app/states/marketState";
import { useDispatch } from "react-redux";

const marketService = new MarketService();

const PollingInterval = 10 * 60 * 1000; // 20 Minutes

const swrPollingOptions = {
  dedupingInterval: PollingInterval - 1_000,
  refreshInterval: PollingInterval,
};

export const MarketInitializer = () => {
  const dispatch = useDispatch();

  useSWR(
    "fetch/usdBrlMarketInformation",
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
