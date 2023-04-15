import { ChildrenProps } from "@/types/childrenProps";
import { FC, forwardRef } from "react";

interface Props extends ChildrenProps {
  className?: string;
}

export const Body = forwardRef<HTMLDivElement, Props>(function Body(
  { children, className = "" },
  ref
) {
  return (
    <div ref={ref} className={`mt-4 p-4 ${className} print:mt-0 print:p-0`}>
      {children}
    </div>
  );
});
