import { decrypt, stretchKey } from "@/app/sec";
import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { useCallback, useMemo } from "react";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Keys } from "@signumjs/crypto";

export const useAccount = () => {
  const { Ledger } = useAppContext();
  const { accountId, salt, securedKeys } = useAppSelector<AccountState>(
    (state) => state.accountState
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
    accountAddress,
    accountId,
    getKeys,
  };
};
