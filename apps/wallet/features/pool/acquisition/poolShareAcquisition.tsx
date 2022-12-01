import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PoolHeader } from "../components/poolHeader";
import { useTranslation } from "next-i18next";
import { Stepper } from "@/app/components/stepper";
import { StepDefinePin, StepSelectQuantity } from "./steps";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { voidFn } from "@/app/voidFn";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { OnStepChangeArgs } from "@/features/account";

enum Steps {
  SelectQuantity,
  Payment,
  Confirmation,
}

interface Props {
  poolId: string;
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const PoolShareAcquisition: FC<Props> = ({ poolId, onStepChange }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const StepCount = 2;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [paid, setPaid] = useState<boolean>(false);

  const routeBack = async () => router.back();

  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, StepCount - 1);
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const previousStep = async () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const availableShares = Math.max(
    pool.maxShareQuantity - pool.token.numHolders,
    0
  );
  const maxAllowedShares = Math.min(4, availableShares);

  useEffect(() => {
    const EmptyItem: BottomNavigationItem = {
      onClick: voidFn,
      icon: <div />,
      disabled: true,
      label: "",
    };

    let canProceed = true;

    if (currentStep === Steps.SelectQuantity) {
      canProceed = quantity > 0 && quantity <= maxAllowedShares;
    } else if (currentStep === Steps.Payment) {
      canProceed = paid;
    }
    //
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === StepCount - 1;

    const bottomNav: BottomNavigationItem[] = [
      {
        label: t("back"),
        onClick: isFirstStep ? routeBack : previousStep,
        icon: <RiArrowLeftCircleLine />,
      },
      EmptyItem,
      {
        label: t("next"),
        onClick: nextStep,
        disabled: !canProceed,
        color: canProceed ? "secondary" : undefined,
        loading: isLastStep && !paid,
        icon: <RiArrowRightCircleLine />,
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [
    currentStep,
    maxAllowedShares,
    nextStep,
    onStepChange,
    paid,
    previousStep,
    quantity,
    routeBack,
    t,
  ]);

  if (!pool) return null;

  return (
    <div className="overflow-hidden">
      <PoolHeader poolData={pool} />
      <Stepper currentStep={currentStep} steps={StepCount} />
      <div className="carousel w-full touch-none">
        <div id="step0" className="carousel-item relative w-full">
          <StepSelectQuantity
            onQuantityChange={(q) => setQuantity(q)}
            maxAllowedShares={maxAllowedShares}
            priceAXTC={pool.tokenRate}
          />
        </div>
        <div id="step1" className="carousel-item relative w-full">
          {/*<StepSeeNewAccount account={accountAddress} />*/}
        </div>
      </div>
    </div>
  );
};
