import { FC } from "react";
import { AssetTable } from "../../components/assetTable";
interface Props {
  poolId: string;
}

export const ShowAssets: FC<Props> = ({ poolId }) => {
  return <AssetTable poolId={poolId} />;
};
