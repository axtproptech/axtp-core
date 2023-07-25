import React, { useMemo } from "react";
import { StatusVariants } from "./assetStatus";

interface StepProps {
  variant: StatusVariants;
  labelTop?: string;
  labelBottom?: string;
  size?: number;
}
export const ProgressStep = ({
  variant,
  labelTop,
  labelBottom,
  size = 0,
}: StepProps) => {
  const variantClass = useMemo(() => {
    switch (variant) {
      case "done":
        return { bg: "bg-success", text: "" };
      case "next":
        return { bg: "bg-info", text: "opacity-60" };
      case "open":
        return { bg: "bg-gray-400 opacity-60", text: "opacity-40" };
      case "lost":
        return { bg: "bg-error", text: "text-error" };
    }
  }, [variant]);

  return (
    <div className={"flex flex-col justify-center items-center text-white"}>
      {labelTop && (
        <div className="pb-1 text-[10px] text-center">{labelTop}</div>
      )}
      <div
        className={`rounded-full xs:w-2 w-3 xs:h-2 h-3 ${variantClass.bg}`}
      />
      <div className={"line"} />
      {labelBottom && (
        <div className={`pt-1 text-[10px] text-center ${variantClass.text}`}>
          {labelBottom}
        </div>
      )}
    </div>
  );
};
