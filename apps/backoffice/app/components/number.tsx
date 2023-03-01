import { NumericFormat } from "react-number-format";
import { FC } from "react";

interface Props {
  value: string | number;
  suffix?: string;
  decimals?: number;
  style?: object;
}

const DefaultStyle = { cursor: "default" };
export const Number: FC<Props> = ({
  suffix,
  value,
  decimals = 2,
  style = DefaultStyle,
}) => (
  <span style={style}>
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
