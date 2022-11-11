import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/router";
import { PoolHeader } from "./sections/poolHeader";
import { PoolData } from "./sections/poolData";
import { useTranslation } from "next-i18next";
import { Body } from "@/app/components/layout/body";
import { Fade, Slide } from "react-awesome-reveal";

interface Props {
  poolId: string;
}

export const PoolDetails: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const { customer } = useAccount();

  if (!pool) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <section>
        <Slide direction="down">
          <Fade>
            <PoolHeader poolData={pool} />
          </Fade>
        </Slide>
      </section>
      <Slide direction="up">
        <Fade>
          <div className="divider">{t("details")}</div>
          <div className="relative">
            <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
          </div>
          <Body className="overflow-x-auto h-[calc(100vh_-_420px)]">
            <PoolData poolData={pool} />
          </Body>
        </Fade>
      </Slide>

      <section>{/*<PoolChart poolData={pool} />*/}</section>
      <section>{/*<PoolActions poolData={pool} />*/}</section>
    </div>
  );
};
