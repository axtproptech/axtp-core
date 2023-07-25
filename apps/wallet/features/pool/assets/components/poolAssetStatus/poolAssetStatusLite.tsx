import { AssetAliasData } from "@axtp/core";
import React from "react";
import { useTranslation } from "next-i18next";
import { ProgressStep } from "./progressStep";
import { AcquisitionStatus, getProgressState } from "./assetStatus";

interface Props {
  asset: AssetAliasData;
}

export const PoolAssetStatusLite = ({ asset }: Props) => {
  const { t } = useTranslation();
  const { acquisitionStatus, acquisitionProgress, acquisitionDate } = asset;
  const statusLabel = AcquisitionStatus[acquisitionStatus] ?? "unknown";
  const progressState = getProgressState(acquisitionProgress);
  return (
    <div className="py-1 w-3/4 sm:w-1/2 lg:w-1/4">
      <div className={"grid grid-rows-1 grid-cols-4 place-items-start gap-x-4"}>
        {progressState.map(({ l, v }) => (
          <ProgressStep key={l} variant={v} />
        ))}
      </div>
      <div className="text-[10px] p-0 rounded-full text-center px-1 mt-1 bg-gray-800 opacity-70">
        {t(statusLabel)}
      </div>
    </div>
  );
};
