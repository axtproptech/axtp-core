import { Number } from "@/app/components/number";
import { TransactionData } from "@/types/transactionData";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useTranslation } from "next-i18next";
import { FcDocument, FcPrivacy } from "react-icons/fc";

interface Props {
  txData: TransactionData;
}

export const ContentItem = ({ txData }: Props) => {
  const { Ledger } = useAppContext();
  const { t } = useTranslation("transactions");

  txData.tokens.sort((a, b) => a.amount - b.amount);

  const hasTokens = txData.tokens.length > 0;
  const hasSigna = txData.signa > 0;
  const hasTokenAmounts = hasTokens && txData.tokens[0].amount > 0;
  const hasMessageAttached = !!txData.message || txData.hasEncryptedMessage;
  const hasAmount = hasSigna || hasTokenAmounts;

  return (
    <div className="flex flex-row justify-between items-end">
      {!hasAmount && !hasMessageAttached && (
        <div className="text-xl font-bold">&nbsp;</div>
      )}

      {!hasAmount && hasMessageAttached && !txData.hasEncryptedMessage && (
        <div className="text-xs truncate w-[180px] md:w-[400px]">
          {txData.message}
        </div>
      )}

      {!hasAmount && hasMessageAttached && txData.hasEncryptedMessage && (
        <div className="text-xs truncate w-[180px] md:w-[400px]">
          <span className="flex flex-row items-center">
            <FcPrivacy className="text-lg mr-1" />
            {t("encryptedMessage")}
          </span>
        </div>
      )}

      {hasSigna && (
        <>
          <div className="text-xl font-bold flex flex-row">
            {hasMessageAttached && <FcDocument className="h-[24px]" />}
            <Number value={txData.signa} suffix={Ledger.SignaPrefix} />
          </div>
        </>
      )}

      {hasTokenAmounts && (
        <>
          <div className="text-xl font-bold flex flex-row">
            {hasMessageAttached && <FcDocument className="h-[24px]" />}
            <Number
              value={txData.tokens[0].amount}
              suffix={txData.tokens[0].name}
            />
          </div>
          {txData.tokens.length == 1 && (
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
