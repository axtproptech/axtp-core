import { ChildrenProps } from "@/types/childrenProps";
import { FC } from "react";

export const Body: FC<ChildrenProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};
