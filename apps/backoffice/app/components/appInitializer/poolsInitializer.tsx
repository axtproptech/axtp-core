import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useEffect } from "react";
import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/poolsState";

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
  const { ledgerService } = useLedgerService();
  const dispatch = useAppDispatch();

  const { data } = useSWR(
    ledgerService ? "fetch/allPools" : null,
    async () => {
      if (!ledgerService) return null;
      return Promise.resolve(MockedPools);
    },
    {
      refreshInterval: 30_000,
    }
  );

  useEffect(() => {
    if (!data) return;
    dispatch(actions.setPoolData(data));
  }, [data]);

  return null;
};
