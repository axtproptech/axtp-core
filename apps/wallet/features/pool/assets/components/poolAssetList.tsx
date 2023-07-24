import { FC, useMemo } from "react";
import { AssetAliasData, AssetAliasMap } from "@axtp/core";
import { PoolAssetsListItem } from "@/features/pool/assets/components/poolAssetListItem";

interface Props {
  assetMap: AssetAliasMap;
}

export const PoolAssetsList: FC<Props> = ({ assetMap }) => {
  const items = useMemo(() => {
    const itemList: (AssetAliasData & { aliasId: string })[] = [];
    for (let [aliasId, alias] of assetMap.entries()) {
      itemList.push({
        aliasId,
        ...alias.getData(),
      });
    }

    itemList.sort((a1, a2) => a1.acquisitionProgress - a2.acquisitionProgress);

    return itemList;
  }, [assetMap]);

  return (
    <div>
      {items.map((a) => (
        <PoolAssetsListItem key={a.aliasId} asset={a} id={a.aliasId} />
      ))}
    </div>
  );
};
