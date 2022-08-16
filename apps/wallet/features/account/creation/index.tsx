import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useMemo, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import {
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
} from "@/features/account/creation/steps";

export interface OnStepChangeArgs {
  steps: number;
  currentStep: number;
  bottomNav: BottomNavigationItem[];
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountCreation: FC<Props> = ({ onStepChange }) => {
  const router = useRouter();
  const StepCount = 4;
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, StepCount - 1);
    setCurrentStep(newStep);
    router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const previousStep = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
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
        <div className="carousel w-full">
          {/*<div id="step0" className="carousel-item relative w-full">*/}
          {/*  <div className="mt-4 prose">*/}
          {/*    <h1>Account Creation</h1>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div id="step0" className="carousel-item relative w-full">
            <StepOne />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <StepTwo />
          </div>
          <div id="step2" className="carousel-item relative w-full">
            <StepThree />
          </div>
          <div id="step3" className="carousel-item relative w-full">
            <StepFour />
          </div>
        </div>
      </div>
    </>
  );
};
