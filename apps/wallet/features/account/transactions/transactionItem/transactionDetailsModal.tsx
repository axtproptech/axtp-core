import { CSSProperties, useMemo } from "react";
import { TransactionData } from "@/types/transactionData";
import { getTransactionUiElements } from "../getTransactionUiElements";
import { useTranslation } from "next-i18next";
import { useAppContext } from "@/app/hooks/useAppContext";
import { DirectionItem } from "./directionItem";
import { ContentItem } from "@/features/account/transactions/transactionItem/contentItem";
import { formatDate } from "@/app/formatDate";
import { useRouter } from "next/router";
import { FcSynchronize } from "react-icons/fc";

interface Props {
  txData: TransactionData;
}

export const PaddingSize = 8;

export const TransactionDetailsModal = ({ txData }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation("transactions");
  const { Ledger } = useAppContext();

  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
