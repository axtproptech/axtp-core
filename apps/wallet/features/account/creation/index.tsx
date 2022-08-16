import { Body } from "@/app/components/layout/body";
import { Container } from "@/app/components/layout/container";
import { Button } from "react-daisyui";
import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useMemo, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";

export interface OnStepChangeArgs {
  steps: number;
  currentStep: number;
  bottomNav: BottomNavigationItem[];
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountCreation: FC<Props> = ({ onStepChange }) => {
  const StepCount = 4;
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, StepCount - 1));
  };

  const previousStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  useEffect(() => {
    const bottomNav = [
      {
        onClick: currentStep > 0 ? previousStep : voidFn,
        icon: currentStep > 0 ? <RiArrowLeftCircleLine /> : <div />,
      },
      {
        onClick: voidFn,
        icon: <div>Regenerate</div>,
      },
      {
        onClick: nextStep,
        icon: <RiArrowRightCircleLine />,
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [currentStep]);

  useEffect(() => {
    onStepChange({
      bottomNav: [
        {
          onClick: voidFn,
          icon: <div />,
        },
        {
          onClick: voidFn,
          icon: <div />,
        },
        {
          onClick: nextStep,
          icon: <RiArrowRightCircleLine />,
        },
      ],
      currentStep: 0,
      steps: StepCount,
    });
  }, []);

  return (
    <>
      <div className="mt-4">
        <Stepper currentStep={currentStep} steps={StepCount}></Stepper>
      </div>
    </>
  );
};
