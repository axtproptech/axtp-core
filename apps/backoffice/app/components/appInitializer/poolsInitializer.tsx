import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/poolsState";

export const PoolsInitializer = () => {
  const { ledgerService } = useLedgerService();
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    ledgerService ? "fetch/allPools" : null,
    async () => {
      if (!ledgerService) return null;
      return ledgerService.poolContract.fetchAllContracts();
    },
    {
      refreshInterval: 60_000,
    }
  );

  useEffect(() => {
    if (!data) return;
    data.forEach((pool) => {
      dispatch(actions.setPoolData(pool));
    });
  }, [data, dispatch]);

  return null;
};
