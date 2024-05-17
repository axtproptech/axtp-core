import { ChildrenProps } from "@/types/childrenProps";

export function StepLayout({ children }: ChildrenProps) {
  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs max-w-lg mx-auto px-4">
      {children}
    </div>
  );
}
