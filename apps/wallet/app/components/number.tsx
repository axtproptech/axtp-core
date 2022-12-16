import { FC, memo } from "react";
import { formatNumber, FormatNumberArgs } from "@/app/formatNumber";

const _Number: FC<FormatNumberArgs> = (args) => {
  return <>{formatNumber(args)}</>;
};

export const Number = memo(_Number);
