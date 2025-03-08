import { FC } from "react";

interface Props {
  className?: string;
}

export const TextLogo: FC<Props> = ({ className = "" }) => (
  <div className={className}>
    <img src="/assets/img/axt-text-logo-2.svg" alt="AXT Logo" />
  </div>
);
