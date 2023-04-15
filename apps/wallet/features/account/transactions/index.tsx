import { Body } from "@/app/components/layout/body";
import { ComponentType, useRef } from "react";
import {
  FixedSizeList as _FixedSizeList,
  FixedSizeListProps,
} from "react-window";
import { TransactionItem } from "@/features/account/transactions/transactionItem";
import { tx } from "./transactions";
const FixedSizeList = _FixedSizeList as ComponentType<FixedSizeListProps>;

export const AccountTransactions = () => {
  const bodyRef = useRef<HTMLDivElement>(null);

  // calculate height of transaction body list dynamically

  return (
    <div className="overflow-hidden h-[100vh]">
      <section>Header</section>
      <div className="relative">
        <div className="absolute z-10 top-4 bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <Body
        ref={bodyRef}
        className="overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent h-[calc(100vh_-_440px)]"
      >
        <FixedSizeList
          height={600}
          width="100%"
          itemCount={tx.transactions.length}
          itemSize={210}
          itemData={tx.transactions}
        >
          {TransactionItem}
        </FixedSizeList>
      </Body>
    </div>
  );
};
