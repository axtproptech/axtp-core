import { ChildrenProps } from "@/types/childrenProps";
import { FC } from "react";

interface Props extends ChildrenProps {
  className?: string;
}

export const Body: FC<Props> = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
