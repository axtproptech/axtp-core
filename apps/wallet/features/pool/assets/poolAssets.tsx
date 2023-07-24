import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC } from "react";
import { useTranslation } from "next-i18next";
import { Body } from "@/app/components/layout/body";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { PoolAssetsHeader } from "@/features/pool/assets/components/poolAssetsHeader";

interface Props {
  poolId: string;
}

export const PoolAssets: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const pool = useAppSelector(selectPoolContractState(poolId));

  if (!pool) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <PoolAssetsHeader poolData={pool} />
      <Fade>
        <div className="divider">{t("assets")}</div>
        <div className="relative">
          <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
        </div>
        <Body className="overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent h-[calc(100vh_-_600px)]">
          <h2> To Do </h2>
        </Body>
      </Fade>
    </div>
  );
};
