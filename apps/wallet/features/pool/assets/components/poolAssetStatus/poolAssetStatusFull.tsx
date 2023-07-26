import { AssetAliasData } from "@axtp/core";
import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { ProgressStep } from "./progressStep";
import {
  AcquisitionStatus,
  getProgressState,
  StatusVariants,
} from "./assetStatus";

interface Props {
  asset: AssetAliasData;
}

function getClass(variant: StatusVariants) {
  switch (variant) {
    case "done":
      return {
        cx: "step-success",
        char: "✓",
      };
    case "next":
      return {
        cx: "step-info",
        char: "⏳",
      };
    case "open":
      return {
        cx: "",
        char: "",
      };
    case "lost":
      return {
        cx: "step-error",
        char: "✕",
      };
  }
}

export const PoolAssetStatusFull = ({ asset }: Props) => {
  const { t } = useTranslation("assets");
  const { acquisitionStatus, acquisitionProgress, acquisitionDate } = asset;
  const statusLabel = AcquisitionStatus[acquisitionStatus] ?? "unknown";
  const progressState = getProgressState(acquisitionProgress);

  return (
    <div className="py-1 w-full text-center">
      <ul className="steps">
        {progressState.map(({ l, v }) => {
          const { cx, char } = getClass(v);
          return (
            <li key={l} className={`relative step ${cx}`} data-content={char}>
              <div className={`text-xs ${v !== "done" ? "opacity-60" : ""}`}>
                {t(l)}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-row justify-center pt-4 ">
        <h2 className="text-xl text-center rounded-badge bg-primary-content w-auto px-4 py-1  animate-wiggle">
          {t(statusLabel)}
        </h2>
      </div>
    </div>
  );
};
