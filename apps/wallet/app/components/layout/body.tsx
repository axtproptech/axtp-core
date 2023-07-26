import { ChildrenProps } from "@/types/childrenProps";
import { CSSProperties, FC, forwardRef } from "react";

interface Props extends ChildrenProps {
  className?: string;
  style?: CSSProperties;
}

export const Body = forwardRef<HTMLDivElement, Props>(function Body(
  { children, className = "", style = {} },
  ref
) {
  return (
    <div
      ref={ref}
      className={`mt-4 p-4 ${className} print:mt-0 print:p-0`}
      style={style}
    >
      {children}
    </div>
  );
});
