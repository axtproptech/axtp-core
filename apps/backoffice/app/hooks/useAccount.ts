import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { Address } from "@signumjs/core";

export const useAccount = () => {
  const { publicKey } = useAppSelector<AccountState>(
    (state) => state.accountState
  );
  let address: Address | null;
  try {
    address = publicKey ? Address.fromPublicKey(publicKey) : null;
  } catch (e) {
    address = null;
  }
  return {
    accountId: address?.getNumericId(),
    publicKey: address?.getPublicKey(),
  };
};
