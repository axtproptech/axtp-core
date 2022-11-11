import { FC, ReactNode, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { Number } from "@/app/components/number";
import { useRouter } from "next/router";
import { PoolContractData } from "@/types/poolContractData";
// @ts-ignore
import hashicon from "hashicon";
import { useTranslation, Trans as T } from "next-i18next";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { useAppContext } from "@/app/hooks/useAppContext";
import { SafeExternalLink } from "@/app/components/navigation/externalLink";
import { RiExternalLinkLine } from "react-icons/ri";
import { Address } from "@signumjs/core";

interface DetailItemProps {
  label: string;
  value: string | ReactNode;
}

const DetailItem: FC<DetailItemProps> = ({ label, value }) => (
  <div className="mb-1">
    <div className="text-xs opacity-80">
      <T i18nKey={label} />
    </div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

interface Props {
  poolData: PoolContractData;
}

export const PoolData: FC<Props> = ({ poolData }) => {
  const account = useAccount();
  const { Ledger } = useAppContext();
  const axtcToken = useAppSelector(selectAXTToken);

  const detailItems = useMemo((): DetailItemProps[] => {
    if (!poolData) return [];

    const axtc = axtcToken.name;

    return [
      {
        label: "details_gmv",
        value: <Number value={poolData.grossMarketValue} suffix={axtc} />,
      },
      {
        label: "details_paidDistribution",
        value: <Number value={poolData.paidDistribution} suffix={axtc} />,
      },
      {
        label: "details_initial",
        value: <Number value={poolData.nominalLiquidity} suffix={axtc} />,
      },
      {
        label: "details_priceToken",
        value: <Number value={poolData.tokenRate} suffix={axtc} />,
      },
      {
        label: "details_maxShares",
        value: <Number value={poolData.maxShareQuantity} />,
      },
      {
        label: "details_soldShares",
        value: (
          <div>
            <Number value={poolData.token.supply} />
          </div>
        ),
      },
      {
        label: "details_numShareHolders",
        value: (
          <div>
            <Number value={poolData.token.numHolders} />
          </div>
        ),
      },
      {
        label: "details_token",
        value: (
          <SafeExternalLink
            href={`${Ledger.ExplorerUrl}/asset/${poolData.token.id}`}
          >
            <span className="flex flex-row items-center">
              {poolData.token.name}
              &nbsp;
              <RiExternalLinkLine />
            </span>
          </SafeExternalLink>
        ),
      },
      {
        label: "details_contract",
        value: (
          <SafeExternalLink
            href={`${Ledger.ExplorerUrl}/at/${poolData.poolId}`}
          >
            <span className="flex flex-row items-center">
              {Address.fromNumericId(
                poolData.poolId,
                Ledger.AddressPrefix
              ).getReedSolomonAddress()}
              &nbsp;
              <RiExternalLinkLine />
            </span>
          </SafeExternalLink>
        ),
      },
    ];
  }, [Ledger.AddressPrefix, Ledger.ExplorerUrl, axtcToken.name, poolData]);

  return (
    <div className="relative md:mx-auto md:w-1/2">
      {detailItems.map(({ label, value }, index) => (
        <DetailItem key={index} label={label} value={value} />
      ))}
    </div>
  );
};
