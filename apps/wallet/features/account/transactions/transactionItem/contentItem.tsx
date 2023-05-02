import { Number } from "@/app/components/number";
import { TransactionData } from "@/types/transactionData";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useTranslation } from "next-i18next";
import { FcDocument, FcPrivacy } from "react-icons/fc";
import { InOutAmount } from "@/features/account/transactions/transactionItem/InOutAmount";

interface Props {
  txData: TransactionData;
}

export const ContentItem = ({ txData }: Props) => {
  const { Ledger } = useAppContext();
  const { t } = useTranslation("transactions");

  txData.tokens.sort((a, b) => a.amount - b.amount);

  const hasTokens = txData.tokens.length > 0;
  const hasSigna = txData.signa !== 0;
  const hasTokenAmounts = hasTokens && txData.tokens[0].amount !== 0;
  const hasMessageAttached = !!txData.message || !!txData.encryptedMessage;
  const hasAmount = hasSigna || hasTokenAmounts;

  return (
    <div className="flex flex-row justify-between items-end">
      {!hasAmount && !hasMessageAttached && (
        <div className="text-xl font-bold">&nbsp;</div>
      )}

      {!hasAmount && hasMessageAttached && !txData.encryptedMessage && (
        <div className="text-xs truncate w-[180px] md:w-[400px]">
          {txData.message}
        </div>
      )}

      {!hasAmount && hasMessageAttached && txData.encryptedMessage && (
        <div className="text-xs truncate w-[180px] md:w-[400px]">
          <span className="flex flex-row items-center">
            <FcPrivacy className="text-lg mr-1" />
            {t("encryptedMessage")}
          </span>
        </div>
      )}

      {hasSigna && (
        <>
          <div className="text-base font-bold flex flex-row">
            {hasMessageAttached && <FcDocument className="h-[24px] mr-1" />}
            <InOutAmount amount={txData.signa} symbol={Ledger.SignaPrefix} />
          </div>
        </>
      )}

      {hasTokenAmounts && (
        <>
          <div className="text-base font-bold flex flex-row">
            {hasMessageAttached && <FcDocument className="h-[24px]" />}
            <InOutAmount
              amount={txData.tokens[0].amount}
              symbol={txData.tokens[0].name}
            />
          </div>
          {txData.tokens.length > 1 && (
            <div className="text-xs">{t("hasMoreTokens")}</div>
          )}
        </>
      )}

      {txData.feeSigna > 0 && (
        <div className="text-xs opacity-60">
          <Number value={txData.feeSigna} suffix={Ledger.SignaPrefix} />
        </div>
      )}
    </div>
  );
};
