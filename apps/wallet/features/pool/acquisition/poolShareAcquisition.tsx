import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PoolHeader } from "../components/poolHeader";
import { useTranslation } from "next-i18next";
import { Stepper } from "@/app/components/stepper";
import {
  StepPaymentPix,
  StepSelectQuantity,
  PaymentMethod,
  StepSelectPaymentMethod,
  StepPaymentUsdc,
} from "./steps";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { voidFn } from "@/app/voidFn";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { OnStepChangeArgs } from "@/features/account";

const StepRoutes = ["quantity", "paymentMethod", "payment"];

interface Props {
  poolId: string;
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const PoolShareAcquisition: FC<Props> = ({ poolId, onStepChange }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const [stepCount, setStepCount] = useState<number>(3);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [paid, setPaid] = useState<boolean>(false);

  const routeBack = async () => router.back();

  const routeStep = async (nextStep: number) => {
    let newRoute = StepRoutes[nextStep];
    await router.push(`#${newRoute}`, `#${newRoute}`, { shallow: true });
  };

  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, stepCount - 1);
    await routeStep(newStep);
    setCurrentStep(newStep);
  };

  const previousStep = async () => {
    const newStep = Math.max(0, currentStep - 1);
    await routeStep(newStep);
    setCurrentStep(newStep);
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

    if (StepRoutes[currentStep] === "quantity") {
      canProceed = quantity > 0 && quantity <= maxAllowedShares;
    }
    //
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === stepCount - 1;

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
    onStepChange({ steps: stepCount, currentStep, bottomNav });
  }, [currentStep, maxAllowedShares, paid, quantity, stepCount]); // keep this, or you have a dead loop here

  if (!pool) return null;

  return (
    <div className="overflow-hidden">
      <PoolHeader poolData={pool} />
      <Stepper currentStep={currentStep} steps={stepCount} />
      <div className="carousel w-full touch-none">
        <div id="quantity" className="carousel-item relative w-full">
          <StepSelectQuantity
            onQuantityChange={(q) => setQuantity(q)}
            maxAllowedShares={maxAllowedShares}
            poolId={pool.poolId}
          />
        </div>
        <div id="paymentMethod" className="carousel-item relative w-full">
          <StepSelectPaymentMethod
            onMethodChange={(m) => setPaymentMethod(m)}
          />
        </div>
        <div id="payment" className="carousel-item relative w-full">
          {paymentMethod === "pix" && (
            <StepPaymentPix
              onStatusChange={() => {}}
              quantity={quantity}
              poolId={pool.poolId}
            />
          )}
          {paymentMethod === "usdc" && (
            <StepPaymentUsdc
              onStatusChange={() => {}}
              quantity={quantity}
              poolId={pool.poolId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
