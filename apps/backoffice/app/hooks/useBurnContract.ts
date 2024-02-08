import { useAppSelector } from "@/states/hooks";
import { selectBurnContractState } from "../states/burnContractState";

import { TokenAccountCredits } from "@axtp/core";

export const useBurnContract = () => {
  const burnContractData = useAppSelector(selectBurnContractState);

  return {
    ...burnContractData,
    isLoading: burnContractData.id === "",
  };
};
