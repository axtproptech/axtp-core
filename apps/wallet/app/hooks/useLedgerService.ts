import { useAppSelector } from "@/states/hooks";
import { useAppContext } from "@/app/hooks/useAppContext";
import { LedgerService } from "@/app/services";
import { useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";

export const useLedgerService = () => {
  const { Ledger } = useAppContext();
  const { accountId } = useAccount();

  return useMemo(() => {
    if (accountId && Ledger.Client) {
      return new LedgerService(Ledger.Client, accountId);
    }
    return null;
  }, [Ledger.Client, accountId]);
};
