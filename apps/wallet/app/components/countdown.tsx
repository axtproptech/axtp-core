import { FC, useEffect, useMemo, useState } from "react";
import { Countdown as DaisyCountdown } from "react-daisyui";

interface Props {
  seconds: number;
  className?: string;
  onTimeout: Function;
}

export const Countdown: FC<Props> = ({
  seconds,
  onTimeout,
  className = "font-mono text-5xl",
}) => {
  const [value, setValue] = useState(seconds);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newValue = Math.max(0, value - 1);
      setValue(newValue);
      if (newValue <= 0) {
        clearTimeout(timer);
        onTimeout();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [onTimeout, value]);

  const { m, s } = useMemo(() => {
    return {
      m: Math.ceil(value / 60) - 1,
      s: value % 60,
    };
  }, [value]);

  return (
    <div className="flex flex-row text-center items-center gap-2">
      <DaisyCountdown className={className} value={m} />
      <p>m</p>
      <DaisyCountdown className={className} value={s} />
      <p>s</p>
    </div>
  );
};
