import { useAppSelector } from "@/states/hooks";
import { TextLogo } from "@/app/components/logo/textLogo";
import { Fade, Slide } from "react-awesome-reveal";
import { selectAllPools } from "@/app/states/poolsState";
import { FC, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { PoolCard } from "@/app/components/cards/poolCard";
import { useRouter } from "next/router";

interface Props {
  poolId: string;
}

export const PoolDetails: FC<Props> = ({ poolId }) => {
  const router = useRouter();
  const pools = useAppSelector(selectAllPools);
  const { customer } = useAccount();

  const pool = useMemo(
    () => pools.find((p) => p.poolId === poolId),
    [poolId, pools]
  );

  if (!pool) return null;

  return (
    <div>
      <section className="relative">
        <Slide direction="down">
          <Fade>
            <TextLogo className="py-4 mx-auto w-[50%] lg:w-[33%]" />
          </Fade>
        </Slide>
      </section>
      <div className="relative">
        <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
      </div>
      <div className="relative overflow-x-hidden h-[calc(100vh_-_140px_-_64px)] lg:h-[calc(100vh_-_180px_-_64px)]">
        <section className="w-full">
          <PoolCard poolData={pool} />
        </section>
      </div>
    </div>
  );
};
