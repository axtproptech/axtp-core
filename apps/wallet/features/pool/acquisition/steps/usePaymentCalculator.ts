import { useAppSelector } from "@/states/hooks";
import { selectBrlUsdMarketData } from "@/app/states/marketState";
import { useAppContext } from "@/app/hooks/useAppContext";

export const usePaymentCalculator = (quantity: number, priceAXTC: number) => {
  const { Market } = useAppContext();
  const brlUsdMarket = useAppSelector(selectBrlUsdMarketData);
  const adjustedBrlUsdPrice =
    brlUsdMarket.current_price + Market.BrlUsdAdjustment;
  const totalAXTC = priceAXTC * quantity;
  return {
    totalAXTC,
    totalBRL: totalAXTC * adjustedBrlUsdPrice,
  };
};
