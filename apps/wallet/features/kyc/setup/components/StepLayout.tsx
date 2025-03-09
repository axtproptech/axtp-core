import { ChildrenProps } from "@/types/childrenProps";
import { Fade } from "react-awesome-reveal";

export function StepLayout({ children }: ChildrenProps) {
  return (
    <Fade className="opacity-0">
      <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs max-w-lg mx-auto px-4">
        {children}
      </div>
    </Fade>
  );
}
