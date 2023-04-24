import { FC } from "react";
import { Number } from "@/app/components/number";

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
      <Number
        value={Math.abs(amount)}
        suffix={symbol.toUpperCase()}
        prefix={amount >= 0 ? "+" : "-"}
      />
    </div>
  );
};
