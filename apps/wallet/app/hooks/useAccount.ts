import { decrypt, stretchKey } from "@/app/sec";
import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { useCallback, useMemo } from "react";
import { Address } from "@signumjs/core";
import { Amount } from "@signumjs/util";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Keys } from "@signumjs/crypto";
import useSWR from "swr";
import { AccountData, DefaultAccountData } from "@/types/accountData";
import { toQuantity, toStableCoinAmount } from "@/app/tokenQuantity";
import { TokenMetaData } from "@/types/tokenMetaData";

export const useAccount = () => {
  const { Ledger, AXTTokenId, AXTPoolTokenIds } = useAppContext();
  const {
    publicKey,
    accountId,
    salt,
    securedKeys,
    customer,
    showVerificationStatus,
  } = useAppSelector<AccountState>((state) => state.accountState);

  const { data, error } = useSWR(
    `/fetchAccount/${accountId}`,
    async () => {
      const account = await Ledger.Client.account.getAccount({
        accountId,
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      });

      const axtBalance = account.assetBalances
        ? account.assetBalances.find(({ asset }) => asset === AXTTokenId)
        : "";

      const poolBalances = account.assetBalances
        ? account.assetBalances.filter(({ asset }) =>
            AXTPoolTokenIds.includes(asset)
          )
        : [];
      const poolTokenRequests = poolBalances.map(({ asset }) =>
        Ledger.Client.asset.getAsset({ assetId: asset })
      );
      const poolTokens = await Promise.all(poolTokenRequests);

      const balancesPools: (TokenMetaData & { quantity: string })[] = [];
      for (let poolToken of poolTokens) {
        const balance = poolBalances.find(
          ({ asset }) => poolToken.asset === asset
        );
        if (!balance) continue;
        balancesPools.push({
          quantity: toQuantity(
            balance.balanceQNT || 0,
            poolToken.decimals
          ).toString(10),
          name: poolToken.name,
          decimals: poolToken.decimals,
          id: poolToken.asset,
        });
      }

      return {
        accountId,
        isActive: !!account.publicKey,
        balanceSIGNA: Amount.fromPlanck(account.balanceNQT).getSigna(),
        name: account.name || "",
        description: account.description || "",
        balanceAXTC: axtBalance
          ? toStableCoinAmount(axtBalance.balanceQNT)
          : "0",
        balancesPools,
      } as AccountData;
    },
    {
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
    accountPublicKey: publicKey,
    accountAddress,
    accountId,
    customer,
    getKeys,
    showVerificationStatus,
  };
};
