import useSWR from "swr";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/marketDataState";
import { FiatTickerService } from "@axtp/core/markets/fiatTickerService";

export const MarketDataInitializer = () => {
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    "fetchUsdBrlMarket",
    () => new FiatTickerService().getUsdBrlMarket(),
    { refreshInterval: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (!data) return;
    dispatch(actions.setUsdBrlMarketData(data));
  }, [data, dispatch]);

  return null;
};
