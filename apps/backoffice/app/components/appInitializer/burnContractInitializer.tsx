import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/burnContractState";

export const BurnContractInitializer = () => {
  const { ledgerService } = useLedgerService();
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    ledgerService ? "fetch/burnContractData" : null,
    async () => {
      if (!ledgerService) return null;
      return ledgerService.burnContract.readContractData();
    },
    {
      refreshInterval: 60_000,
    }
  );

  useEffect(() => {
    if (!data) return;
    dispatch(actions.setBurnContractData(data));
  }, [data, dispatch]);

  return null;
};
