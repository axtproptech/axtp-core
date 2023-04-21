import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR from "swr";
import { mapLedgerTransaction } from "@/app/mapLedgerTransaction";
import {
  selectAllPoolTokens,
  selectAXTToken,
  TokenState,
} from "@/app/states/tokenState";

export const useAccountTransactions = () => {
  const { Ledger } = useAppContext();
  const { accountId } = useAppSelector<AccountState>(
    (state) => state.accountState
  );
  const poolTokens = useAppSelector(selectAllPoolTokens);
  const axtToken = useAppSelector(selectAXTToken);

  const { data, error } = useSWR(
    `/fetchAccountTransactions/${accountId}`,
    async () => {
      const accountTransactions =
        await Ledger.Client.account.getAccountTransactions({
          accountId,
          resolveDistributions: true,
          firstIndex: 0,
          lastIndex: 50,
        });

      return accountTransactions.transactions.map((tx) =>
        mapLedgerTransaction(tx, {
          accountId,
          relevantTokens: [...poolTokens, axtToken],
        })
      );
    },
    {
      refreshInterval: Ledger.PollingInterval,
    }
  );

  const { data: pending, error: pendingErr } = useSWR(
    `/fetchAccountTransactions/pending/${accountId}`,
    async () => {
      const pendingTransactions =
        await Ledger.Client.account.getUnconfirmedAccountTransactions(
          accountId
        );

      return pendingTransactions.unconfirmedTransactions.map((tx) =>
        mapLedgerTransaction(tx, {
          accountId,
          relevantTokens: [...poolTokens, axtToken],
        })
      );
    },
    {
      refreshInterval: 10_000,
    }
  );

  // Missing pending transactions...

  return {
    isLoading: !data && !error,
    transactions: data && !error ? data : [],
    pendingTransactions: pending || [],
    error,
  };
};
