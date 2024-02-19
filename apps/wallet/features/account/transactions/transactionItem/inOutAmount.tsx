import { FC } from "react";
import { Numeric } from "@/app/components/numeric";

interface Props {
  amount: number;
  symbol: string;
  className?: string;
}

export const InOutAmount: FC<Props> = ({ amount, symbol, className = "" }) => {
  return (
    <div
      className={`${
        amount >= 0 ? "text-green-400" : "text-red-400"
      } ${className}`}
    >
      <Numeric
        value={Math.abs(amount)}
        suffix={symbol.toUpperCase()}
        prefix={amount >= 0 ? "+" : "-"}
      />
    </div>
  );
};
