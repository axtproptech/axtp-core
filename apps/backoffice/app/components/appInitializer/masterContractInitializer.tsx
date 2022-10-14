import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/masterContractState";

export const MasterContractInitializer = () => {
  const { ledgerService } = useLedgerService();
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    ledgerService ? "fetch/masterContractData/" : null,
    async () => {
      if (!ledgerService) return null;
      return ledgerService.masterContract.readContractData();
    },
    {
      refreshInterval: 30_000,
    }
  );

  useEffect(() => {
    if (!data) return;
    dispatch(actions.setMasterContractData(data));
  }, [data, dispatch]);

  return null;
};
