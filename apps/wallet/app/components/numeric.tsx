import { FC, memo } from "react";
import { formatNumber, FormatNumberArgs } from "@/app/formatNumber";

const _Numeric: FC<FormatNumberArgs> = (args) => {
  return <>{formatNumber(args)}</>;
};

export const Numeric = memo(_Numeric);
