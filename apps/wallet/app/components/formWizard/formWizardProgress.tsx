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

export const FormWizardProgress: FC<Props> = ({ currentStep, steps }) => {
  return (
    <div className="flex flex-row justify-center w-1/2 mx-auto print:hidden">
      {Array(steps)
        .fill(1)
        .map((_, i) => (
          <div className="mx-4" key={i}>
            <StepIndicator isActive={currentStep - 1 === i}></StepIndicator>
          </div>
        ))}
    </div>
  );
};
