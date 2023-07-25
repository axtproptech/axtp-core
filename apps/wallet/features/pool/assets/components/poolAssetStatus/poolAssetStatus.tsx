import { AssetAliasData } from "@axtp/core";
import { PoolAssetStatusFull } from "./poolAssetStatusFull";
import { PoolAssetStatusLite } from "./poolAssetStatusLite";

interface Props {
  full?: boolean;
  asset: AssetAliasData;
}
export const PoolAssetStatus = ({ full = false, asset }: Props) => {
  return full ? (
    <PoolAssetStatusFull asset={asset} />
  ) : (
    <PoolAssetStatusLite asset={asset} />
  );
};
