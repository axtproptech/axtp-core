import useSWR from "swr";
import { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/poolsState";
import { useAppContext } from "@/app/hooks/useAppContext";
import { PoolContractData } from "@/types/poolContractData";
import { useLedgerService } from "@/app/hooks/useLedgerService";

const MockedPools = {
  "1": {
    poolId: "1",
    token: {
      name: "PST0001",
      supply: "100",
      quantity: "30",
      id: "123451",
    },
    balance: "10",
    transactions: [],
    approvalStatusDistribution: {
      approvedAccounts: [],
      quantity: "0",
    },
    maxShareQuantity: 100,
    nominalLiquidity: 300_000,
    paidDistribution: 0,
    tokenRate: 3_000,
  },
  "2": {
    poolId: "2",
    token: {
      name: "PST0002",
      supply: "75",
      quantity: "72",
      id: "123452",
    },
    balance: "10",
    transactions: [],
    approvalStatusDistribution: {
      approvedAccounts: [],
      quantity: "0",
    },
    maxShareQuantity: 75,
    nominalLiquidity: 250_000,
    paidDistribution: 175000,
    tokenRate: 2_000,
  },
};

export const PoolsInitializer = () => {
  const ledgerService = useLedgerService();
  const { Ledger } = useAppContext();
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    ledgerService ? "fetch/allPools" : null,
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
    data.forEach((pool: PoolContractData) => {
      dispatch(actions.setPoolData(pool));
    });
  }, [data]);

  return null;
};
