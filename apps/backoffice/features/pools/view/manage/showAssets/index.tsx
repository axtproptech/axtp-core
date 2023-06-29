import { FC } from "react";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { AssetTable } from "@/features/pools/view/components/assetTable";
interface Props {
  poolId: string;
}

export const ShowAssets: FC<Props> = ({ poolId }) => {
  useLedgerService();
  return <AssetTable poolId={poolId} />;
};
