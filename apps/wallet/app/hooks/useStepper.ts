import { useState } from "react";
import { useRouter } from "next/router";

export function useStepper(_stepCount: number) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(_stepCount);
  const router = useRouter();
  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, stepCount - 1);
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const previousStep = async () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  return {
    setStepCount,
    currentStep,
    stepsCount: _stepCount,
    nextStep,
    previousStep,
  };
}
