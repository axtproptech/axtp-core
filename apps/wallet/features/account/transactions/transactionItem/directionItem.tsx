import { TransactionData } from "@/types/transactionData";
import { useTranslation } from "next-i18next";

interface DirectionItemProps {
  txData: TransactionData;
}

export const DirectionItem = ({ txData }: DirectionItemProps) => {
  const { t } = useTranslation("transactions");
  return (
    <div className="flex flex-row justify-between items-center">
      {txData.direction === "out" && (
        <>
          <div className="text-xs">{t("sentTo")}</div>
          <div>{txData.receiverAddress}</div>
        </>
      )}

      {txData.direction === "in" && (
        <>
          <div className="text-xs">{t("gotFrom")}</div>
          <div>{txData.senderAddress}</div>
        </>
      )}
      {txData.direction === "self" && <div>&nbsp;</div>}

      {txData.direction === "burn" && (
        <>
          <div>&nbsp;</div>
          <div>{t("burnt")}</div>
        </>
      )}
    </div>
  );
};
