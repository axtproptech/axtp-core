import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";

export const useMasterContract = (poolId: string) => () => {
  return useAppSelector(selectPoolContractState(poolId));
};
