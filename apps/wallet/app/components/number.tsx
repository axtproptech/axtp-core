import { FC, memo, useMemo } from "react";

interface Props {
  value: number | bigint | string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const _Number: FC<Props> = ({ value, prefix, suffix, decimals }) => {
  // TODO: make configurable later!
  const language = "pt-BR";
  const format = useMemo(
    () =>
      new Intl.NumberFormat(language, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }),
    [language]
  );

  const n = typeof value === "string" ? parseFloat(value) : value;
  return (
    <>
      {`${prefix ? prefix + " " : ""}${format.format(n)}${
        suffix ? " " + suffix : ""
      }`}
    </>
  );
};

export const Number = memo(_Number);
