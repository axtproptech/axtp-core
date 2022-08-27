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
import { AccountData, DefaultAccountData } from "@/types/accountData";
import { toStableCoinAmount } from "@/app/tokenQuantity";

export const useAccount = () => {
  const { Ledger, AXTTokenId } = useAppContext();
  const { accountId, salt, securedKeys } = useAppSelector<AccountState>(
    (state) => state.accountState
  );

  const { data } = useSWR(
    `/fetchAccount/${accountId}`,
    async () => {
      const [account, accountTransactions] = await Promise.all([
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

      const axtBalance = account.assetBalances.find(
        ({ asset }) => asset === AXTTokenId
      );

      return {
        accountId,
        // @ts-ignore
        isActive: !!account.publicKey,
        balanceSigna: Amount.fromPlanck(account.balanceNQT).getSigna(),
        name: account.name || "",
        description: account.description || "",
        transactions: accountTransactions.transactions.map((tx) =>
          mapLedgerTransaction(tx, mappingContext)
        ),
        balanceAxt: axtBalance
          ? toStableCoinAmount(axtBalance.balanceQNT)
          : "0",
        // TODO: add AXTPxxxx balances
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
  }, [Ledger.AddressPrefix, accountId]);

  return {
    accountData: data || { ...DefaultAccountData, accountId },
    accountAddress,
    accountId,
    getKeys,
  };
};
