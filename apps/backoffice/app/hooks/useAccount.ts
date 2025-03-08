import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { Address } from "@signumjs/core";
import { Config } from "@/app/config";
import { useAppContext } from "@/app/hooks/useAppContext";

export const useAccount = () => {
  const {
    Accounts: { Principal },
  } = useAppContext();
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
