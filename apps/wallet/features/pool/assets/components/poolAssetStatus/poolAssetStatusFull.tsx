import { AssetAliasData } from "@axtp/core";
import React from "react";
import { useTranslation } from "next-i18next";
import {
  AcquisitionStatus,
  getProgressState,
  StatusVariants,
} from "./assetStatus";
import { formatDate } from "@/app/formatDate";
import { useRouter } from "next/router";

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
  const { locale } = useRouter();
  const { acquisitionStatus, acquisitionProgress, revenueStartDate } = asset;
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
        <h2 className="text-md text-center w-auto px-4 py-1">
          {Date.now() < revenueStartDate.getTime()
            ? t("asset_estimated_revenue_start", {
                time: formatDate({ date: revenueStartDate, locale }),
              })
            : t("asset_has_revenue")}
        </h2>
      </div>
      <div className="flex flex-row justify-center pt-4 ">
        <h2 className="text-xl text-center rounded-badge bg-primary-content w-auto px-4 py-1  animate-wiggle">
          {t(statusLabel)}
        </h2>
      </div>
    </div>
  );
};
