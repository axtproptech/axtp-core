import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";

export const KycInitializer = () => {
  const { accountPublicKey, customer } = useAccount();
  const { KycService, Ledger } = useAppContext();

  useEffect(() => {
    if (accountPublicKey && customer) {
      // fire and forget
      KycService.assignPublicKeyToCustomer(
        customer.customerId,
        accountPublicKey,
        Ledger.IsTestNet
      );
    }
  }, [KycService, Ledger.IsTestNet, accountPublicKey, customer]);

  return null;
};
