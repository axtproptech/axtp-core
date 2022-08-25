import { FC, memo, useMemo } from "react";

interface Props {
  value: number | bigint | string;
  prefix?: string;
  suffix?: string;
}

const _Number: FC<Props> = ({ value, prefix, suffix }) => {
  // TODO: make configurable later!
  const language = "pt-BR";
  const format = useMemo(() => new Intl.NumberFormat(language), [language]);

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
