import { useAppSelector } from "@/states/hooks";
import { selectBrlUsdMarketData } from "@/app/states/marketState";
import { useAppContext } from "@/app/hooks/useAppContext";
import { selectPoolContractState } from "@/app/states/poolsState";

export const usePaymentCalculator = (quantity: number, poolId: string) => {
  const { Market } = useAppContext();
  const { tokenRate, aliasData, token } = useAppSelector(
    selectPoolContractState(poolId)
  );

  const amountSoldTokens = parseFloat(token.supply);
  const pricing = aliasData.pricing.find(
    (price) => amountSoldTokens <= price.tokenAmount
  );
  const priceAXTC = pricing?.valueAXTC || tokenRate;

  const brlUsdMarket = useAppSelector(selectBrlUsdMarketData);
  const adjustedBrlUsdPrice =
    brlUsdMarket.current_price + Market.BrlUsdAdjustment;
  const totalAXTC = priceAXTC * quantity;
  return {
    totalAXTC,
    totalBRL: totalAXTC * adjustedBrlUsdPrice,
    adjustedBrlUsdPrice,
  };
};
