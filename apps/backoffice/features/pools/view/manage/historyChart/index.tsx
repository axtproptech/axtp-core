import { Card } from "@mui/material";
import { chartData, DataPoint } from "./chartData";
import dynamic from "next/dynamic";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useMemo } from "react";
import { TransactionAssetSubtype, TransactionType } from "@signumjs/core";
import { ChainTime } from "@signumjs/util";
import { toStableCoinAmount, toStableCoinQuantity } from "@/app/tokenQuantity";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  loading: () => null,
  ssr: false,
});

export const HistoryChart = () => {
  const { transactions, token } = useMasterContract();

  const data = useMemo(() => {
    if (!transactions.length) return [];

    let currentBalanceQNT = toStableCoinQuantity(token.balance);
    let history: DataPoint[] = [[Date.now(), parseFloat(token.balance)]];
    for (let tx of transactions) {
      if (
        tx.type === TransactionType.Asset &&
        tx.subtype === TransactionAssetSubtype.AssetMint
      ) {
        currentBalanceQNT -= parseInt(tx.attachment["quantityQNT"], 10);
        history.push([
          ChainTime.fromChainTimestamp(tx.timestamp).getDate().getTime(),
          parseFloat(toStableCoinAmount(currentBalanceQNT)),
        ]);
      } else if (
        tx.type === TransactionType.Asset &&
        tx.subtype === TransactionAssetSubtype.AssetTransfer &&
        !tx.recipient
      ) {
        currentBalanceQNT += parseInt(tx.attachment["quantityQNT"], 10);
        history.push([
          ChainTime.fromChainTimestamp(tx.timestamp).getDate().getTime(),
          parseFloat(toStableCoinAmount(currentBalanceQNT)),
        ]);
      }
    }
    return history.reverse();
  }, [transactions]);

  return (
    <Card sx={{ p: 2 }}>
      {/*@ts-ignore*/}
      <DynamicChart {...chartData(data)} />
    </Card>
  );
};
