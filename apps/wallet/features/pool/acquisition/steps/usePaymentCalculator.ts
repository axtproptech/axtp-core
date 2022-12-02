import { useAppSelector } from "@/states/hooks";
import { selectBrlUsdMarketData } from "@/app/states/marketState";
import { useAppContext } from "@/app/hooks/useAppContext";
import { selectPoolContractState } from "@/app/states/poolsState";

export const usePaymentCalculator = (quantity: number, poolId: string) => {
  const { Market } = useAppContext();
  const { tokenRate } = useAppSelector(selectPoolContractState(poolId));
  const brlUsdMarket = useAppSelector(selectBrlUsdMarketData);
  const adjustedBrlUsdPrice =
    brlUsdMarket.current_price + Market.BrlUsdAdjustment;
  const totalAXTC = tokenRate * quantity;
  return {
    totalAXTC,
    totalBRL: totalAXTC * adjustedBrlUsdPrice,
  };
};
