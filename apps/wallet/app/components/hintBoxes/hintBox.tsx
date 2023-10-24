import { ClassNameProps } from "@/types/classNameProps";
import { FC } from "react";
import { ChildrenProps } from "@/types/childrenProps";

interface Props extends ClassNameProps, ChildrenProps {
  text?: string;
}

export const HintBox: FC<Props> = ({ className = "", text = "", children }) => (
  <section
    className={`w-full mx-auto text-justify border border-base-content/50 p-4 rounded relative`}
  >
    {text && <div className={`${className}`}>{text}</div>}
    {children}
  </section>
);
