import { Greeting } from "@/app/components/greeting";
import { SafeExternalLink } from "@/app/components/navigation/externalLink";
import { RiExternalLinkLine } from "react-icons/ri";
import { useAppContext } from "@/app/hooks/useAppContext";
import { AccountData } from "@/types/accountData";
import { useMemo } from "react";
import { Address } from "@signumjs/core";

interface Props {
  account: AccountData;
}

export const AccountHeader = ({ account }: Props) => {
  const { Ledger } = useAppContext();

  const accountAddress = useMemo(() => {
    try {
      return Address.fromNumericId(
        account.accountId,
        Ledger.AddressPrefix
      ).getReedSolomonAddress();
    } catch (e) {
      return "";
    }
  }, [Ledger, account.accountId]);

  return (
    <div className="text-center">
      <Greeting />
      <SafeExternalLink
        href={`${Ledger.ExplorerUrl}/address/${account.accountId}`}
      >
        <span className="flex flex-row items-center">
          <h2 className="text-xl font-bold">{accountAddress}</h2>
          &nbsp;
          <RiExternalLinkLine />
        </span>
      </SafeExternalLink>
    </div>
  );
};
