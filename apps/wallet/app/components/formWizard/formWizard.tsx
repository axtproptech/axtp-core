import { useState } from "react";
import { FormWizardProgress } from "./formWizardProgress";

export interface FormWizardStepProps<T, V = any> {
  step: number;
  data: T;
  updateStepCount: (count: number) => void;
  updateData: (key: keyof T, value: V) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export interface FormWizardProps<T, V = any> {
  stepCount: number;
  initialData: T;
  children: (props: {
    updateStepCount: (count: number) => void;
    data: T;
    previousStep: () => void;
    updateData: (key: keyof T, value: V) => void;
    nextStep: () => void;
    step: number;
    stepCount: number;
  }) => React.ReactNode;
}

export function FormWizard<T, V = any>({
  children,
  stepCount: _stepCount,
  initialData,
}: FormWizardProps<T, V>) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<T>(initialData);
  const [stepCount, setStepCount] = useState(_stepCount);

  const updateData = (key: keyof T, value: V) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, stepCount));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const updateStepCount = (count: number) => {
    if (count < 0 || count > 10) {
      console.error("Trying to set invalid step count - ignored", count);
      return;
    }
    setStepCount(count);
    setStep((prev) => Math.min(prev, count));
  };

  return (
    <div>
      <FormWizardProgress currentStep={step} steps={stepCount} />
      <div>
        {children({
          step,
          stepCount,
          updateStepCount,
          nextStep,
          previousStep,
          data,
          updateData,
        })}
      </div>
    </div>
  );
}
