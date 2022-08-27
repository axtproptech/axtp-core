import { useAppContext } from "@/app/hooks/useAppContext";
import { LedgerService } from "@/app/services";
import { useMemo } from "react";

export const useLedgerService = () => {
  const { Ledger } = useAppContext();

  return useMemo(() => {
    if (Ledger.Client) {
      return new LedgerService(Ledger.Client);
    }
    return null;
  }, [Ledger.Client]);
};
