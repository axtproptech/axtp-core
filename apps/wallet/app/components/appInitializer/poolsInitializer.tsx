import useSWR from "swr";
import { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { poolActions } from "@/app/states/poolsState";
import { useAppContext } from "@/app/hooks/useAppContext";
import { PoolContractData } from "@/types/poolContractData";
import { useLedgerService } from "@/app/hooks/useLedgerService";

export const PoolsInitializer = () => {
  const ledgerService = useLedgerService();
  const { Ledger } = useAppContext();
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    "fetch/allPools",
    async () => {
      if (!ledgerService) return null;
      return ledgerService.poolContract.fetchAllContracts();
    },
    {
      dedupingInterval: Ledger.PollingInterval - 1_000,
      refreshInterval: Ledger.PollingInterval,
    }
  );

  useEffect(() => {
    if (!data) return;

    dispatch(poolActions.reset());
    data.forEach((pool: PoolContractData) => {
      dispatch(poolActions.setPoolData(pool));
    });
  }, [data, dispatch]);

  return null;
};
