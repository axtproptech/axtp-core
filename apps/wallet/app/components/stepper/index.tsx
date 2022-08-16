import { FC } from "react";

interface IndicatorProps {
  isActive?: boolean;
}

const StepIndicator: FC<IndicatorProps> = ({ isActive = false }) => {
  return (
    <div
      className={`rounded-full h-2 w-2 ${
        isActive ? "bg-primary" : "border border-base-content"
      }`}
    />
  );
};

interface Props {
  currentStep: number;
  steps: number;
}

export const Stepper: FC<Props> = ({ currentStep, steps }) => {
  return (
    <div className="flex flex-row justify-between w-1/2 mx-auto">
      {Array(steps)
        .fill(1)
        .map((_, i) => (
          <StepIndicator key={i} isActive={currentStep === i}></StepIndicator>
        ))}
    </div>
  );
};
