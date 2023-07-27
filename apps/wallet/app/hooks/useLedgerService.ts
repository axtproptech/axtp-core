import { useAppContext } from "@/app/hooks/useAppContext";
import { LedgerService } from "@/app/services";
import { useMemo } from "react";

export const useLedgerService = () => {
  const { Ledger, Accounts } = useAppContext();

  return useMemo(() => {
    if (Ledger.Client && Accounts.Principal) {
      return new LedgerService(Ledger.Client, Accounts.Principal);
    }
    return null;
  }, [Ledger.Client, Accounts.Principal]);
};
