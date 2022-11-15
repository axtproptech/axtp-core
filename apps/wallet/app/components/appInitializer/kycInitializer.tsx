import { useEffect } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";

export const KycInitializer = () => {
  const { publicKey, customer } = useAppSelector((state) => state.accountState);
  const { KycService, Ledger } = useAppContext();
  const dispatch = useAppDispatch();

  useSWR(
    customer ? `/fetchCustomer/${customer.customerId}` : null,
    async () => {
      try {
        const data = await KycService.fetchCustomerData(customer.customerId);
        if (data) {
          dispatch(accountActions.setCustomer(data));
        }
      } catch (e: any) {
        console.error(e);
      }
    }
  );

  useEffect(() => {
    if (publicKey && customer) {
      // fire and forget
      KycService.assignPublicKeyToCustomer(
        customer.customerId,
        publicKey,
        Ledger.IsTestNet
      );
    }
  }, [KycService, Ledger.IsTestNet, publicKey, customer]);

  return null;
};
