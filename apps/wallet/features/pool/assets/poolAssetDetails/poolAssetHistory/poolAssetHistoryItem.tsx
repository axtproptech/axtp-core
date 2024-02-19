import { AssetAliasHistoryItem } from "@axtp/core";
import { PoolAssetStatus } from "../../components/poolAssetStatus";
import { Numeric } from "@/app/components/numeric";
import { useRouter } from "next/router";
import { ChainTime } from "@signumjs/util";
import { formatDate } from "@/app/formatDate";
import { useAppContext } from "@/app/hooks/useAppContext";
import { RiFundsLine, RiRefund2Line, RiStockLine } from "react-icons/ri";

interface Props {
  txId: string;
  data: AssetAliasHistoryItem;
}

const IconSize = 12;
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
        <div className="flex flex-row justify-between items-center gap-x-1">
          <div className="grow">
            <div className="text-[10px] xs:w-[96px] md:w-[180px] text-primary opacity-60 text-ellipsis whitespace-nowrap overflow-hidden">
              <div>{formatDate({ date: date, locale })}</div>
            </div>
            <PoolAssetStatus asset={asset} />
          </div>
          <div className="text-lg mr-4 flex flex-row items-baseline gap-x-0.5">
            <RiFundsLine size={IconSize} />
            <Numeric value={performance} decimals={0} />
            <small className="text-[10px]">%</small>
          </div>
          <div className="flex flex-col justify-end">
            <div className="text-md text-success flex flex-row items-baseline gap-x-0.5">
              <RiStockLine size={IconSize} />
              <Numeric value={asset.estimatedMarketValue} decimals={0} />
              <small className="text-[10px]">USD</small>
            </div>
            <div className="text-xs text-error flex flex-row items-baseline gap-x-0.5">
              <RiRefund2Line size={IconSize} />
              <Numeric value={asset.accumulatedCosts} decimals={0} />
              <small className="text-[10px]">USD</small>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
