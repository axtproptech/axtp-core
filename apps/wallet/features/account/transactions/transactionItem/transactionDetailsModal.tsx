import { FC } from "react";
import { TransactionData } from "@/types/transactionData";
import { getTransactionUiElements } from "../getTransactionUiElements";
import { useTranslation } from "next-i18next";
import { useAppContext } from "@/app/hooks/useAppContext";
import { formatDate } from "@/app/formatDate";
import { useRouter } from "next/router";
import { Button, Modal } from "react-daisyui";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { openExternalUrl } from "@/app/openExternalUrl";
import { Number } from "@/app/components/number";
import { ChildrenProps } from "@/types/childrenProps";
import { InOutAmount } from "@/features/account/transactions/transactionItem/InOutAmount";
import { HintBoxEncryptedMessage } from "@/features/account/transactions/transactionItem/hintBoxEncryptedMessage";
import { Fade, Zoom } from "react-awesome-reveal";

const RowItem: FC<ChildrenProps & { className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`flex flex-row items-center justify-start gap-x-2 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

const Label: FC<ChildrenProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface Props {
  txData: TransactionData | null;
  open: boolean;
  onClose: () => void;
}

export const TransactionDetailsModal = ({ txData, open, onClose }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation("transactions");
  const { Ledger } = useAppContext();

  if (!txData) return null;

  const tx = getTransactionUiElements(txData);

  const openInExplorer = () => {
    if (!txData) return;
    openExternalUrl(txData.explorerUrl);
  };

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
      <Modal.Header className="font-bold mb-4 gap-y-1 flex flex-col">
        <RowItem className="justify-center mb-1">
          <tx.icon size={36} />
          <div>{t(tx.typeName)}</div>
        </RowItem>
        <RowItem>
          <div className="text-sm opacity-60 text-center w-full">
            {formatDate({ date: txData.dateTime, locale })}
          </div>
        </RowItem>
        <RowItem>
          <div className="text-base text-center w-full font-mono">
            Id: {txData?.id}
          </div>
        </RowItem>
        <div className="divider my-2" />
      </Modal.Header>

      <Modal.Body className="gap-y-1 flex flex-col">
        {tx.message && (
          <div className="mb-2">
            <HintBox
              className="relative max-h-[120px] overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent"
              text={tx.message}
            />
          </div>
        )}
        {tx.encryptedMessage && <HintBoxEncryptedMessage tx={tx} />}
        {tx.direction === "out" && (
          <RowItem>
            <Label>{t("sentTo")}:</Label>
            <div>{tx.receiverAddress}</div>
          </RowItem>
        )}
        {tx.direction === "in" && (
          <RowItem>
            <Label>{t("gotFrom")}:</Label>
            <div>{tx.senderAddress}</div>
          </RowItem>
        )}
        {txData.direction === "burn" && (
          <RowItem>
            <div>🔥 {t("burnt")} 🔥</div>
          </RowItem>
        )}

        {tx.signa !== 0 && (
          <RowItem>
            <Label>{t("amount")}:</Label>
            <div
              className={
                tx.direction === "in" ? "text-green-400" : "text-red-400"
              }
            >
              <InOutAmount amount={tx.signa} symbol={Ledger.SignaPrefix} />
            </div>
          </RowItem>
        )}

        {tx.tokens.map(({ name, amount }) => (
          <RowItem key={name}>
            <Label>{t("amount")}:</Label>
            <InOutAmount amount={amount} symbol={name} />
          </RowItem>
        ))}

        {tx.feeSigna !== 0 && (
          <RowItem>
            <Label>{t("fee")}:</Label>
            <Number value={tx.feeSigna} suffix={Ledger.SignaPrefix} />
          </RowItem>
        )}
      </Modal.Body>

      <Modal.Actions>
        <Button onClick={openInExplorer}>{t("openInExplorer")}</Button>
      </Modal.Actions>
    </Modal>
  );
};
