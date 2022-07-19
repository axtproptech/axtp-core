import { useCallback, useState } from "react";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { LedgerService } from "@/app/services/ledgerService";

export const useLedgerAction = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { ledgerService } = useLedgerService();
  const [transactionId, setTransactionId] = useState("");
  const { showError, showSuccess } = useSnackbar();

  const execute = useCallback(
    async (
      ledgerActionFn: (service: LedgerService) => Promise<ConfirmedTransaction>
    ) => {
      if (!ledgerService) return;

      setIsExecuting(true);
      setTransactionId("");
      try {
        const tx = await ledgerActionFn(ledgerService);
        setTransactionId(tx.transactionId);
        showSuccess("Successfully executed transaction");
      } catch (e: any) {
        showError(`Someting failed: ${e.message}`);
      } finally {
        setIsExecuting(false);
      }
    },
    [ledgerService]
  );

  return {
    transactionId,
    isExecuting,
    execute,
  };
};
