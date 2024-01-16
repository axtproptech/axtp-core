import { Body } from "@/app/components/layout/body";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import {
  PaddingSize,
  TransactionItemCard,
} from "@/features/account/transactions/transactionItem/transactionItemCard";
import { AccountHeader } from "@/features/account/components/accountHeader";
import { useAccount } from "@/app/hooks/useAccount";
import { useAccountTransactions } from "@/app/hooks/useAccountTransactions";
import * as React from "react";
import { useTranslation } from "next-i18next";
import { TransactionDetailsModal } from "./transactionItem/transactionDetailsModal";
import { LoadingBox } from "@/app/components/hintBoxes/loadingBox";
import { TransactionData } from "@/types/transactionData";
import { Slide, Zoom } from "react-awesome-reveal";

export const AccountTransactions = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("transactions");
  const { accountData } = useAccount();
  const { transactions, error, isLoading, pendingTransactions } =
    useAccountTransactions();
  const [detailIndex, setDetailIndex] = useState(-1);

  const allTransactions = [...pendingTransactions, ...transactions];
  const height = bodyRef.current
    ? bodyRef.current.clientHeight - 112 - 64 - 32
    : 600;

  useEffect(() => {
    function handleItemClick(e: Event) {
      //@ts-ignore
      const { index } = e.detail;
      setDetailIndex(index);
    }

    document.addEventListener("tx-item-clicked", handleItemClick);
    return () => {
      document.removeEventListener("tx-item-clicked", handleItemClick);
    };
  }, []);

  return (
    <div ref={bodyRef} className="overflow-hidden h-[100vh]">
      <section className="pt-12 md:pt-8 flex-row flex mx-auto justify-center">
        <AccountHeader account={accountData} />
      </section>
      <TransactionDetailsModal
        txData={detailIndex !== -1 ? allTransactions[detailIndex] : null}
        open={detailIndex !== -1}
        onClose={() => setDetailIndex(-1)}
      />
      <Body className="relative">
        {isLoading && (
          <section className="mt-[30%]">
            <Zoom triggerOnce>
              <LoadingBox
                title={t("loadingTransactions")}
                text={t("loadingTransactionsHint")}
              />
            </Zoom>
          </section>
        )}

        {!isLoading && (
          <>
            <div className="absolute z-10 top-4 bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
            <Slide direction="up" triggerOnce>
              <FixedSizeList<TransactionData[]>
                className={
                  "overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent h-[calc(100vh_-_440px)]"
                }
                height={height}
                width="100%"
                itemCount={allTransactions.length}
                itemSize={80 + PaddingSize * 2}
                itemData={allTransactions}
              >
                {TransactionItemCard}
              </FixedSizeList>
            </Slide>
            <div className="absolute z-10 bottom-4 bg-gradient-to-t from-base-100 h-4 w-full opacity-80" />
          </>
        )}
      </Body>
    </div>
  );
};
