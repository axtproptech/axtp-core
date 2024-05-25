import { useAppContext } from "@/app/hooks/useAppContext";
import { LedgerService } from "@/app/services";
import { useMemo } from "react";

export const useLedgerService = () => {
  const { Ledger, Accounts } = useAppContext();

  return useMemo(() => {
    if (Ledger.Client && Accounts.Principal && Accounts.Signature) {
      return new LedgerService(
        Ledger.Client,
        Accounts.Principal,
        Accounts.Signature
      );
    }
    return null;
  }, [Ledger.Client, Accounts]);
};
