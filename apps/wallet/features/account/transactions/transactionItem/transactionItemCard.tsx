import { CSSProperties, useMemo } from "react";
import { TransactionData } from "@/types/transactionData";
import { getTransactionUiElements } from "../getTransactionUiElements";
import { useTranslation } from "next-i18next";
import { DirectionItem } from "./directionItem";
import { ContentItem } from "@/features/account/transactions/transactionItem/contentItem";
import { formatDate } from "@/app/formatDate";
import { useRouter } from "next/router";
import { FcSynchronize } from "react-icons/fc";

interface Props {
  style: CSSProperties;
  data: TransactionData[];
  index: number;
}

export const PaddingSize = 8;

export const TransactionItemCard = ({ style, data, index }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation("transactions");

  const txData = useMemo(() => {
    const txData = data[index];
    return getTransactionUiElements(txData);
  }, [data, index]);

  function handleOnClick() {
    document.dispatchEvent(
      new CustomEvent("tx-item-clicked", { detail: { index } })
    );
  }

  return (
    <div
      className="card card-side bg-base-200 hover:!cursor-zoom-in"
      style={{
        ...style,
        // @ts-ignore
        top: style.top + PaddingSize,
        // @ts-ignore
        height: style.height - PaddingSize,
      }}
      onClick={handleOnClick}
    >
      <figure className="p-4 w-[64px] md:w-[80px]">
        {txData.isPending ? (
          <FcSynchronize className="animate-spin" />
        ) : (
          <txData.icon />
        )}
      </figure>
      <div className="card-body p-4 pl-0 gap-0">
        <div className="flex flex-row justify-between text-xs opacity-60">
          <div>{t(txData.typeName)}</div>
          <div>{formatDate({ date: txData.dateTime, locale })}</div>
        </div>
        <DirectionItem txData={txData} />
        <ContentItem txData={txData} />
      </div>
    </div>
  );
};
