import { FC } from "react";
import { AccountData } from "@/types/accountData";
import { useAppSelector } from "@/states/hooks";
import { selectAllPools } from "@/app/states/poolsState";
import { PoolCard } from "@/app/components/cards/poolCard";

interface Props {
  accountData?: AccountData;
}

export const DashboardPools: FC<Props> = ({ accountData }) => {
  const pools = useAppSelector(selectAllPools);

  // todo: return pools ny the tokens this account owns
  return (
    <div>
      {pools.map((p) => {
        return (
          <PoolCard
            className="mt-4 bg-gradient-to-r from-base-100 to-secondary"
            key={p.poolId}
            poolData={p}
            accountShares={2}
          />
        );
      })}
    </div>
  );
};
