import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/router";
import { PoolHeader } from "./sections/poolHeader";
import { PoolData } from "./sections/poolData";
import { useTranslation } from "next-i18next";
import { Body } from "@/app/components/layout/body";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { PoolActions } from "@/features/pool/sections/poolActions";

interface Props {
  poolId: string;
}

export const PoolDetails: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const pool = useAppSelector(selectPoolContractState(poolId));

  if (!pool) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <Slide direction="down">
        <Fade>
          <PoolHeader poolData={pool} />
        </Fade>
      </Slide>
      <Zoom>
        <Fade>
          <PoolActions poolData={pool} />
        </Fade>
      </Zoom>
      <Slide direction="up">
        <Fade>
          <div className="divider">{t("details")}</div>
          <div className="relative">
            <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
          </div>
          <Body className="overflow-x-auto h-[calc(100vh_-_600px)]">
            <PoolData poolData={pool} />
          </Body>
        </Fade>
      </Slide>
    </div>
  );
};
