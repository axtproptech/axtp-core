import { Body } from "@/app/components/layout/body";
import { ComponentType, useEffect, useRef, useState } from "react";
import {
  FixedSizeList as _FixedSizeList,
  FixedSizeListProps,
} from "react-window";
import {
  PaddingSize,
  TransactionItem,
} from "@/features/account/transactions/transactionItem/transactionItem";
import { AccountHeader } from "@/features/account/components/accountHeader";
import { useAccount } from "@/app/hooks/useAccount";
import { useAccountTransactions } from "@/app/hooks/useAccountTransactions";
import { HintBox } from "@/app/components/hintBox";
import { AnimatedIconGlobe } from "@/app/components/animatedIcons/animatedIconGlobe";
import * as React from "react";
import { useTranslation } from "next-i18next";

const FixedSizeList = _FixedSizeList as ComponentType<FixedSizeListProps>;

export const AccountTransactions = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("transactions");
  const { accountData } = useAccount();
  const { transactions, error, isLoading, pendingTransactions } =
    useAccountTransactions();

  const allTransactions = [...pendingTransactions, ...transactions];
  const height = bodyRef.current
    ? bodyRef.current.clientHeight - 112 - 64 - 32
    : 600;

  return (
    <div ref={bodyRef} className="overflow-hidden h-[100vh]">
      <section className="pt-12 md:pt-8 flex-row flex mx-auto justify-center">
        <AccountHeader account={accountData} />
      </section>
      <Body className="relative">
        {isLoading && (
          <section className="mt-[30%]">
            <HintBox>
              <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
                <AnimatedIconGlobe loopDelay={1000} />
              </div>
              <div className="text-center">
                <h3 className="my-1">{t("loadingTransactions")}</h3>
                <small>{t("loadingTransactionsHint")}</small>
              </div>
            </HintBox>
          </section>
        )}

        {!isLoading && (
          <>
            <div className="absolute z-10 top-4 bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
            <FixedSizeList
              className={
                "overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent h-[calc(100vh_-_440px)]"
              }
              height={height}
              width="100%"
              itemCount={allTransactions.length}
              itemSize={80 + PaddingSize * 2}
              itemData={allTransactions}
            >
              {TransactionItem}
            </FixedSizeList>
            <div className="absolute z-10 bottom-4 bg-gradient-to-t from-base-100 h-4 w-full opacity-80" />
          </>
        )}
      </Body>
    </div>
  );
};
