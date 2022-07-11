import { useAppSelector } from "@/states/hooks";
import { useAccount } from "@/app/hooks/useAccount";
import { selectNodeHost } from "@/app/states/appState";
import { useMemo } from "react";
import { useExtensionWallet } from "@/app/hooks/useExtensionWallet";
import { LedgerService } from "@/app/services/ledgerService";

export const useLedgerService = () => {
  const { publicKey } = useAccount();
  const wallet = useExtensionWallet();
  const nodeHost = useAppSelector(selectNodeHost);
  const ledgerService = useMemo(() => {
    if (!publicKey || !nodeHost || !wallet) {
      return null;
    }
    console.debug("Using following Signum Host:", nodeHost);
    return new LedgerService(nodeHost, publicKey, wallet);
  }, [publicKey, nodeHost, wallet]);

  return { ledgerService };
};
