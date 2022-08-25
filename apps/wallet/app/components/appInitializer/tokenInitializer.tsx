import { useAppDispatch } from "@/states/hooks";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR from "swr";
import { tokenActions } from "@/app/states/tokenState";
import { toStableCoinAmount } from "@/app/tokenQuantity";
import { Ledger as LedgerClient } from "@signumjs/core";
import { TokenData } from "@/types/tokenData";

async function fetchTokenData(
  tokenId: string,
  ledger: LedgerClient
): Promise<TokenData> {
  const {
    name,
    decimals,
    quantityCirculatingQNT,
    asset: id,
    numberOfAccounts: numHolders,
  } = await ledger.asset.getAsset({ assetId: tokenId });
  return {
    name,
    decimals,
    supply: toStableCoinAmount(quantityCirculatingQNT),
    id,
    numHolders,
  };
}

export const TokenInitializer = () => {
  const { AXTPoolTokenIds, Ledger, AXTTokenId } = useAppContext();
  const dispatch = useAppDispatch();

  const fetchOptions = {
    dedupingInterval: 2 * Ledger.PollingInterval - 1000,
    refreshInterval: 2 * Ledger.PollingInterval,
  };

  useSWR(
    `/fetchPoolTokens`,
    async () => {
      try {
        const promises = AXTPoolTokenIds.map((tokenId) =>
          fetchTokenData(tokenId, Ledger.Client)
        );
        const results = await Promise.all(promises);
        results.forEach((t) => dispatch(tokenActions.updatePoolTokenData(t)));
      } catch (e: any) {
        console.error("TokenInitializer:fetchPoolTokens", e);
      }
    },
    fetchOptions
  );

  useSWR(
    `/fetchAXTToken`,
    async () => {
      try {
        const data = await fetchTokenData(AXTTokenId, Ledger.Client);
        dispatch(tokenActions.updateAXTToken(data));
      } catch (e: any) {
        console.error("TokenInitializer:fetchAXTToken", e);
      }
    },
    fetchOptions
  );

  return null;
};
