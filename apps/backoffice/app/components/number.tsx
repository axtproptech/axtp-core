import { NumericFormat } from "react-number-format";
import { FC } from "react";

interface Props {
  value: string | number;
  suffix?: string;
  decimals?: number;
}

export const Number: FC<Props> = ({ suffix, value, decimals = 2 }) => (
  <span style={{ cursor: "default" }}>
    {suffix ? (
      <NumericFormat
        value={value}
        displayType="text"
        decimalScale={decimals}
        suffix={` ${suffix}`}
        fixedDecimalScale
        thousandSeparator
      />
    ) : (
      <NumericFormat
        value={value}
        displayType="text"
        decimalScale={decimals}
        fixedDecimalScale
        thousandSeparator
      />
    )}
  </span>
);
