import { useState } from "react";

export function useFormWizard<T, V = any>(initalState: T, stepCount: number) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<T>(initalState);

  const updateData = (key: keyof T, value: V) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, stepCount));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return {
    step,
    nextStep,
    previousStep,
    updateData,
    data,
  };
}
