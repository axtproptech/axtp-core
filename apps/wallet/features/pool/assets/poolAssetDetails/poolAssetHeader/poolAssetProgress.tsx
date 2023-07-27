import { FC } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { AssetAliasData, type AssetAliasHistory } from "@axtp/core";
import { PoolAssetStatus } from "../../components/poolAssetStatus";

interface Props {
  poolData: PoolContractData;
  asset: AssetAliasData;
  assetHistory?: AssetAliasHistory;
}

export const PoolAssetProgress: FC<Props> = ({ poolData, asset }) => {
  return (
    <section className="mx-auto">
      <PoolAssetStatus asset={asset} full />
    </section>
  );
};
