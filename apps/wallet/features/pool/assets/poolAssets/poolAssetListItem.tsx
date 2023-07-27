import { FC } from "react";
import { AssetAliasData } from "@axtp/core";
import { PoolAssetStatus } from "../components/poolAssetStatus";
import { Number } from "@/app/components/number";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiFundsBoxLine, RiRefund2Line, RiStockLine } from "react-icons/ri";

interface Props {
  id: string;
  asset: AssetAliasData;
}

const IconSize = 12;

export const PoolAssetsListItem: FC<Props> = ({ id, asset }) => {
  const router = useRouter();

  const performance = asset.accumulatedCosts
    ? (asset.estimatedMarketValue / asset.accumulatedCosts) * 100
    : 0;

  return (
    <Link href={`${router.asPath}/${id}`}>
      <div className="border border-primary-content border-solid p-2 px-4 rounded-lg mb-2 glass cursor-pointer">
        <div className="flex flex-row justify-between items-center gap-x-2">
          <div className="grow">
            <div className="text-[10px] xs:w-[96px] md:w-[180px] text-primary opacity-60 text-ellipsis whitespace-nowrap overflow-hidden">
              {asset.name}
            </div>
            <PoolAssetStatus asset={asset} />
          </div>
          <div className="text-lg mr-4 flex flex-row items-baseline gap-x-1">
            <RiFundsBoxLine size={IconSize} />
            <Number value={performance} suffix="%" decimals={2} />
          </div>
          <div className="flex flex-col justify-end">
            <span className="text-md text-success flex flex-row items-baseline gap-x-1 ">
              <RiStockLine size={IconSize} />
              <Number
                value={asset.estimatedMarketValue}
                prefix="$"
                decimals={2}
              />
            </span>
            <span className="text-xs text-error flex flex-row items-baseline gap-x-1 ">
              <RiRefund2Line size={IconSize} />
              <Number value={asset.accumulatedCosts} prefix="$" decimals={2} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
