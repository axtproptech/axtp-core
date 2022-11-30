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

export const PoolShareAcquisition: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const pool = useAppSelector(selectPoolContractState(poolId));

  if (!pool) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <h2>Buy token</h2>
    </div>
  );
};
