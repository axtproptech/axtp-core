import { useAppSelector } from "@/states/hooks";
import {
  selectIsInitializingMasterContractState,
  selectMasterContractState,
} from "@/app/states/masterContractState";

export const useMasterContract = () => {
  const masterContractData = useAppSelector(selectMasterContractState);
  const isLoading = useAppSelector(selectIsInitializingMasterContractState);
  return {
    ...masterContractData,
    isLoading,
  };
};
