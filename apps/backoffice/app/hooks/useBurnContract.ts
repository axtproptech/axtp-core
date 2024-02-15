import { useAppSelector } from "@/states/hooks";
import { selectBurnContractState } from "../states/burnContractState";
import { useCallback } from "react";
import { ChainValue } from "@signumjs/util";

export const useBurnContract = () => {
  const burnContractData = useAppSelector(selectBurnContractState);

  const getWithdrawnAmount = useCallback(
    (tokenId: string) => {
      const trackableToken = burnContractData.trackableTokens[tokenId];
      if (!trackableToken) return null;
      return ChainValue.create(trackableToken.decimals).setAtomic(
        trackableToken.balance
      );
    },
    [burnContractData]
  );

  return {
    ...burnContractData,
    isLoading: burnContractData.id === "",
    getWithdrawnAmount,
  };
};
