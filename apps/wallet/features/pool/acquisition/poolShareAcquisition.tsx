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
  StepPaymentUsdc1,
  StepPaymentUsdc2,
  NetworkType,
} from "./steps";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { voidFn } from "@/app/voidFn";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { OnStepChangeArgs } from "@/features/account";

const StepRoutes = {
  pix: ["quantity", "paymentMethod", "paymentPix"],
  usdc: ["quantity", "paymentMethod", "paymentUsdc-1", "paymentUsdc-2"],
};

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
  const [usdcNetwork, setUsdcNetwork] = useState<NetworkType>("eth");
  const [paid, setPaid] = useState<boolean>(false);

  const routeBack = async () => router.back();

  const routeStep = async (step: number) => {
    let newRoute = StepRoutes[paymentMethod][step];
    console.log("routeStep", newRoute);
    await router.push(`#${newRoute}`, `#${newRoute}`, { shallow: true });
  };

  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, stepCount - 1);
    setCurrentStep(newStep);
    await routeStep(newStep);
  };

  const previousStep = async () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    await routeStep(newStep);
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

    if (StepRoutes[paymentMethod][currentStep] === "quantity") {
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

  useEffect(() => {
    setStepCount(StepRoutes[paymentMethod].length);
  }, [paymentMethod]);

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
        {paymentMethod === "pix" && (
          <div id="paymentPix" className="carousel-item relative w-full">
            <StepPaymentPix
              onStatusChange={() => {}}
              quantity={quantity}
              poolId={pool.poolId}
            />
          </div>
        )}
        {paymentMethod === "usdc" && (
          <>
            <div id="paymentUsdc-1" className="carousel-item relative w-full">
              <StepPaymentUsdc1
                onNetworkChange={(network) => setUsdcNetwork(network)}
                quantity={quantity}
                poolId={pool.poolId}
              />
            </div>
            <div id="paymentUsdc-2" className="carousel-item relative w-full">
              <StepPaymentUsdc2
                onStatusChange={() => {}}
                quantity={quantity}
                poolId={pool.poolId}
                network={usdcNetwork}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
