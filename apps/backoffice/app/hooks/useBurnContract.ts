import { useAppSelector } from "@/states/hooks";
import { selectBurnContractState } from "../states/burnContractState";

export const useBurnContract = () => {
  const burnContractData = useAppSelector(selectBurnContractState);
  return {
    ...burnContractData,
    isLoading: burnContractData.id === "",
  };
};
