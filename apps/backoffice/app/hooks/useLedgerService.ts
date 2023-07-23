import { useAppSelector } from "@/states/hooks";
import { useAccount } from "@/app/hooks/useAccount";
import { selectNodeHost } from "@/app/states/appState";
import { useMemo } from "react";
import { useExtensionWallet } from "@/app/hooks/useExtensionWallet";
import { LedgerService } from "@/app/services/ledgerService";
import { useAppContext } from "@/app/hooks/useAppContext";

export const useLedgerService = () => {
  const {
    Accounts: { Principal },
  } = useAppContext();
  const { publicKey } = useAccount();
  const wallet = useExtensionWallet();
  const nodeHost = useAppSelector(selectNodeHost);
  const ledgerService = useMemo(() => {
    if (!publicKey || !nodeHost || !wallet || !Principal) {
      return null;
    }
    return new LedgerService(nodeHost, publicKey, Principal, wallet);
  }, [publicKey, nodeHost, wallet, Principal]);

  return { ledgerService };
};
