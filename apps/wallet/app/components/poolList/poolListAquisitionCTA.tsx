import { RiArrowDownSLine } from "react-icons/ri";
import Link from "next/link";
import { PoolContractData } from "@/types/poolContractData";
import { FC, useMemo } from "react";
// @ts-ignore
import hashicon from "hashicon";
import { useTranslation } from "next-i18next";
import { Numeric } from "@/app/components/numeric";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { Button } from "react-daisyui";

interface Props {
  availablePools: PoolContractData[];
}

export const PoolListAquisitionCTA: FC<Props> = ({ availablePools }) => {
  const { t } = useTranslation();
  const { name } = useAppSelector(selectAXTToken);

  const pools = useMemo(() => {
    return availablePools.map((p) => {
      const soldTokens = parseFloat(p.token.supply);
      const freeSeats = Math.max(p.maxShareQuantity - soldTokens, 0);
      const icon = hashicon(p.poolId, { size: 32 }).toDataURL();
      return {
        name: p.token.name,
        poolId: p.poolId,
        price: p.tokenRate,
        freeSeats,
        icon,
      };
    });
  }, [availablePools]);

  return (
    <>
      {pools.length > 1 && (
        <div className="mt-4 dropdown dropdown-hover">
          <label tabIndex={0} className="btn m-1">
            {t("buy_token")}&nbsp;
            <RiArrowDownSLine />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {pools.map((p) => {
              return (
                <li key={p.poolId}>
                  <Link href={`/pool/${p.poolId}`}>
                    <div className="flex flex-row justify-content">
                      <img src={p.icon} alt={`Pool Icon ${p.name}`} />
                      <div className="flex flex-col justify-content">
                        {p.name}
                        <small>
                          <Numeric value={p.price} suffix={name} />
                        </small>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {pools.length === 1 && (
        <Button color="primary" className="mt-4">
          <Link href={`/pool/${pools[0].poolId}/acquisition`}>
            {t("buy_token")}
          </Link>
        </Button>
      )}
    </>
  );
};
