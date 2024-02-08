import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { Address } from "@signumjs/core";
import { Config } from "@/app/config";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useEffect, useMemo } from "react";
import { PermissionRole } from "@/types/permissionRole";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import useSWR from "swr";

export const useAccount = () => {
  const {
    Accounts: { Principal },
  } = useAppContext();
  // const {ledgerService} = useLedgerService();
  const { publicKey } = useAppSelector<AccountState>(
    (state) => state.accountState
  );

  let address: Address | null;
  try {
    address = publicKey
      ? Address.fromPublicKey(publicKey, Config.Signum.AddressPrefix)
      : null;
  } catch (e) {
    address = null;
  }

  return {
    isConnected: !!address,
    accountId: address?.getNumericId(),
    publicKey: address?.getPublicKey(),
    rsAddress: address?.getReedSolomonAddress(),
  };
};
