import { ChildrenProps } from "@/types/childrenProps";
import { FC } from "react";

export const Container: FC<ChildrenProps> = ({ children }) => (
  <div className="container mx-auto relative overflow-y-auto">{children}</div>
);
