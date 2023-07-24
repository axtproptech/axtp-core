import { AssetAliasData } from "@axtp/core";
import React, { useMemo } from "react";
import { Steps } from "react-daisyui";
import { useTranslation } from "next-i18next";

type StatusVariants = "done" | "next" | "open" | "lost";
interface Props {
  asset: AssetAliasData;
}

const AcquisitionStatus: Record<number, string> = {
  0: "asset_s_in_acquisition",
  1: "asset_s_renting",
  2: "asset_s_rehab",
  3: "asset_s_maintenance",
  4: "asset_s_sold",
  5: "asset_s_lost",
};

const AcquisitionProgress: Record<number, string> = {
  0: "asset_p_paid",
  1: "asset_p_cert",
  2: "asset_p_notified",
  3: "asset_p_acquired",
  4: "asset_p_recovered",
};

export const PoolAssetStatus = ({ asset }: Props) => {
  const { t } = useTranslation();
  const { acquisitionStatus, acquisitionProgress, acquisitionDate } = asset;
  const statusLabel = AcquisitionStatus[acquisitionStatus] ?? "unknown";

  const stepVariants: StatusVariants[] = useMemo(() => {
    switch (acquisitionProgress) {
      case 0:
        return ["done", "next", "open", "open"];
      case 1:
        return ["done", "done", "next", "open"];
      case 2:
        return ["done", "done", "done", "next"];
      case 3:
        return ["done", "done", "done", "done"];
      case 4:
        return ["done", "done", "done", "lost"];
      default:
        return ["open", "open", "open", "open"];
    }
  }, [acquisitionProgress]);

  return (
    <div className="py-1 w-3/4 md:w-1/2 lg:w-1/4">
      <div className={"grid grid-rows-1 grid-cols-4 place-items-start gap-x-4"}>
        <Step variant={stepVariants[0]} />
        <Step variant={stepVariants[1]} />
        <Step variant={stepVariants[2]} />
        <Step variant={stepVariants[3]} />
      </div>
      <div className="text-xs p-0">{t(statusLabel)}</div>
    </div>
  );
};

interface StepProps {
  variant: StatusVariants;
  labelTop?: string;
  labelBottom?: string;
}
const Step = ({ variant, labelTop, labelBottom }: StepProps) => {
  const variantClass = useMemo(() => {
    switch (variant) {
      case "done":
        return "bg-success";
      case "next":
        return "bg-info";
      case "open":
        return "bg-gray-400 opacity-60";
      case "lost":
        return "bg-error";
    }
  }, [variant]);

  return (
    <div className={"flex flex-col justify-center items-center"}>
      {labelTop && <div className="text-[10px] text-center">{labelTop}</div>}
      <div className={`rounded-full xs:w-2 w-3 xs:h-2 h-3 ${variantClass}`} />
      {labelBottom && (
        <div className="text-[10px] text-center">{labelBottom}</div>
      )}
    </div>
  );
};
