import useSWR from "swr";
import { mockedAssetAlias } from "@/features/pools/view/components/mockedAssetAlias";
import { useLedgerService } from "@/app/hooks/useLedgerService";

export const usePoolAssets = (poolId: string) => {
  const { ledgerService } = useLedgerService();

  const { data: assets, error } = useSWR(
    `pool/${poolId}/assets`,
    async () => {
      return ledgerService
        ? ledgerService.asset.fetchAllPoolAssetsData(poolId)
        : null;

      // FIXME: remove mocked data
      // return Promise.resolve(mockedAssetAlias);
    },
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
