import { FC, ReactNode, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { Numeric } from "@/app/components/numeric";
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
import { ChainValue } from "@signumjs/util";

interface DetailItemProps {
  hidden?: boolean;
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
  const { Ledger } = useAppContext();
  const axtcToken = useAppSelector(selectAXTToken);

  const detailItems = useMemo((): DetailItemProps[] => {
    if (!poolData) return [];

    const axtc = axtcToken.name;
    let goal = 0;
    if (poolData.goalQuantity) {
      goal = Number(
        ChainValue.create(axtcToken.decimals)
          .setAtomic(poolData.goalQuantity)
          .getCompound()
      );
    }

    return [
      {
        label: "details_gmv",
        value: <Numeric value={poolData.grossMarketValue} suffix={axtc} />,
      },
      {
        label: "details_paidDistribution",
        value: <Numeric value={poolData.paidDistribution} suffix={axtc} />,
      },
      {
        label: "details_initial",
        value: <Numeric value={poolData.nominalLiquidity} suffix={axtc} />,
      },
      {
        hidden: goal === 0,
        label: "details_goal",
        value: (
          <span>
            <Numeric value={goal} suffix={axtc} />
          </span>
        ),
      },
      {
        label: "details_priceToken",
        value: <Numeric value={poolData.tokenRate} suffix={axtc} />,
      },
      {
        label: "details_maxShares",
        value: <Numeric value={poolData.maxShareQuantity} />,
      },
      {
        label: "details_soldShares",
        value: <Numeric value={poolData.token.supply} />,
      },
      {
        label: "details_numShareHolders",
        value: <Numeric value={poolData.token.numHolders} />,
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
    <div className="relative md:mx-auto md:w-2/3">
      {detailItems.map(({ label, value, hidden = false }, index) =>
        hidden ? null : <DetailItem key={index} label={label} value={value} />
      )}
    </div>
  );
};
