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
import { Button, Modal } from "react-daisyui";
import { HintBox } from "@/app/components/hintBox";
import { openExternalUrl } from "@/app/openExternalUrl";

interface Props {
  txData: TransactionData | null;
  open: boolean;
  onClose: () => void;
}
export const TransactionDetailsModal = ({ txData, open, onClose }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation("transactions");
  const { Ledger } = useAppContext();

  const openInExplorer = () => {
    if (!txData) return;
    openExternalUrl(Ledger.ExplorerUrl + "/tx/" + txData.id);
  };
  // if (!txData) return null;

  return (
    <Modal open={open} onClickBackdrop={onClose}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={onClose}
      >
        ✕
      </Button>
      <Modal.Header className="font-bold">{txData?.id}</Modal.Header>

      <Modal.Body>
        <HintBox className="relative">
          <div className="absolute top-0 text-base font-bold">{}</div>
        </HintBox>
        You've been selected for a chance to get one year of subscription to use
        Wikipedia for free!
      </Modal.Body>

      <Modal.Actions>
        <Button onClick={openInExplorer}>See in Explorer!</Button>
      </Modal.Actions>
    </Modal>
  );
};
