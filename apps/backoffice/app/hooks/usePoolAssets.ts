import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";

export const usePoolAssets = (poolId: string) => {
  const { ledgerService } = useLedgerService();

  const { data: assets, error } = useSWR(
    `pool/${poolId}/assets`,
    async () =>
      ledgerService ? ledgerService.asset.fetchAllPoolAssetsData(poolId) : null,
    {
      dedupingInterval: 60_000,
      refreshInterval: 120_000,
    }
  );

  return {
    assets,
    isLoading: !assets && !error,
  };
};
