import { AssetAliasHistoryItem } from "@axtp/core";
import { PoolAssetStatus } from "../../components/poolAssetStatus";
import { Number } from "@/app/components/number";
import { useRouter } from "next/router";
import { ChainTime } from "@signumjs/util";
import { formatDate } from "@/app/formatDate";
import { useAppContext } from "@/app/hooks/useAppContext";
import Link from "next/link";

interface Props {
  txId: string;
  data: AssetAliasHistoryItem;
}

export const PoolAssetHistoryItem = ({ data, txId }: Props) => {
  const { locale } = useRouter();
  const {
    Ledger: { ExplorerUrl },
  } = useAppContext();

  const { assetData: asset, transactionId, timestamp } = data;

  const performance = asset.accumulatedCosts
    ? (asset.estimatedMarketValue / asset.accumulatedCosts) * 100
    : 0;

  const date = ChainTime.fromChainTimestamp(timestamp).getDate();

  return (
    <a
      href={`${ExplorerUrl}/tx/${txId}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="relative bg-base-200 p-2 px-4 rounded-lg mb-2 cursor-pointer">
        <div className="flex flex-row justify-between items-center gap-x-2">
          <div className="grow">
            <div className="text-[10px] xs:w-[96px] md:w-[180px] text-primary opacity-60 text-ellipsis whitespace-nowrap overflow-hidden">
              <div>{formatDate({ date: date, locale })}</div>
            </div>
            <PoolAssetStatus asset={asset} />
          </div>
          <div className="text-lg mr-4">
            <Number value={performance} suffix="%" decimals={2} />
          </div>
          <div className="flex flex-col justify-end">
            <div className="text-md text-success">
              <Number
                value={asset.estimatedMarketValue}
                prefix="$"
                decimals={2}
              />
            </div>
            <div className="text-xs text-error">
              <Number value={asset.accumulatedCosts} prefix="$" decimals={2} />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
