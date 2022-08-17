import { ChildrenProps } from "@/types/childrenProps";
import { FC } from "react";

export const Container: FC<ChildrenProps> = ({ children }) => {
  return <div className="container mx-auto relative">{children}</div>;
};
