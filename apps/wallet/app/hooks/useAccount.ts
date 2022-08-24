import { decrypt, stretchKey } from "@/app/sec";
import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { useCallback, useMemo } from "react";
import { Address } from "@signumjs/core";
import { Amount } from "@signumjs/util";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Keys } from "@signumjs/crypto";
import useSWR from "swr";
import { mapLedgerTransaction } from "@/app/mapLedgerTransaction";
import { AccountData } from "@/types/accountData";

export const useAccount = () => {
  const { Ledger, AXTTokenId } = useAppContext();
  const { accountId, salt, securedKeys } = useAppSelector<AccountState>(
    (state) => state.accountState
  );

  const { data: accountData, error } = useSWR(
    `/fetchAccount/${accountId}`,
    async () => {
      const [accountData, accountTransactions] = await Promise.all([
        Ledger.Client.account.getAccount({
          accountId,
          includeCommittedAmount: false,
          includeEstimatedCommitment: false,
        }),
        // TODO: think of storing transactions and getting them incrementally only
        Ledger.Client.account.getAccountTransactions({
          accountId,
          resolveDistributions: true,
          firstIndex: 0,
          lastIndex: 50,
        }),
      ]);

      const mappingContext = {
        accountId,
        // TODO: gather TokenInfo dynamically
        poolTokens: [],
        axtToken: {
          name: "AXT",
          decimals: 2,
          id: AXTTokenId,
        },
      };

      return {
        // @ts-ignore
        isActive: !!accountData.publicKey,
        balanceSigna: Amount.fromPlanck(accountData.balanceNQT).getSigna(),
        name: accountData.name || "",
        description: accountData.description || "",
        transactions: accountTransactions.transactions.map((tx) =>
          mapLedgerTransaction(tx, mappingContext)
        ),
        // TODO: add AXT Balance and AXTPxxxx balances
      } as AccountData;
    },
    {
      dedupingInterval: Ledger.PollingInterval - 1000,
      refreshInterval: Ledger.PollingInterval,
    }
  );

  const getKeys = useCallback(
    async (pin: string) => {
      try {
        const { key } = await stretchKey(pin, salt);
        const jsonString = await decrypt(key, securedKeys);
        const keys = JSON.parse(jsonString);
        return keys as Keys;
      } catch (e) {
        throw new Error("Could not decrypt keys");
      }
    },
    [salt, securedKeys]
  );

  const accountAddress = useMemo(() => {
    try {
      if (accountId) {
        return Address.fromNumericId(
          accountId,
          Ledger.AddressPrefix
        ).getReedSolomonAddress();
      }
    } catch (e: any) {
      console.error("Problem converting account id", e);
    }

    return null;
  }, [accountId]);

  return {
    accountData,
    accountAddress,
    accountId,
    getKeys,
  };
};
