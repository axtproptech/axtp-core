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
  StepPaymentUsdc2,
  StepPaymentUsdc3,
} from "./steps";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiWallet3Line,
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
} from "react-icons/ri";
import { OnStepChangeArgs } from "@/features/account";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";

const StepRoutes = {
  pix: ["quantity", "paymentMethod", "paymentPix"],
  usdc: [
    "quantity",
    "paymentMethod",
    // "paymentUsdc-1",
    "paymentUsdc-2",
    "paymentUsdc-3",
  ],
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

  // TODO: atm, we support only one network - ETH. But  code for more is already implemented
  const [usdcProtocol, setUsdcProtocol] =
    useState<BlockchainProtocolType>("eth");
  const [paid, setPaid] = useState<boolean>(false);

  const routeBack = async () => router.back();

  const routeHome = async () => router.replace("/");
  const routeAccount = async () => router.replace("/account");

  const routeStep = async (step: number) => {
    let newRoute = StepRoutes[paymentMethod][step];
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
    let canProceed = true;

    if (StepRoutes[paymentMethod][currentStep] === "quantity") {
      canProceed = quantity > 0 && quantity <= maxAllowedShares;
    }

    //
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === stepCount - 1;

    if (isLastStep) {
      canProceed = paid;
    }

    const HomeItem: BottomNavigationItem = {
      onClick: routeHome,
      icon: <RiHome6Line />,
      disabled: isLastStep && !paid,
      label: t("home"),
    };

    const bottomNav: BottomNavigationItem[] = [
      {
        label: t("back"),
        onClick: isFirstStep ? routeBack : previousStep,
        icon: <RiArrowLeftCircleLine />,
        disabled: isLastStep && paid,
      },
      HomeItem,
      {
        label: t("next"),
        onClick: isLastStep ? routeAccount : nextStep,
        disabled: !canProceed,
        color: canProceed ? "secondary" : undefined,
        loading: isLastStep && !paid,
        icon: isLastStep ? <RiWallet3Line /> : <RiArrowRightCircleLine />,
      },
    ];
    onStepChange({ steps: stepCount, currentStep, bottomNav });
  }, [currentStep, maxAllowedShares, paid, quantity, stepCount]); // keep this, or you have a dead loop here

  useEffect(() => {
    setStepCount(StepRoutes[paymentMethod].length);
  }, [paymentMethod]);

  const handleStatus = (status: "pending" | "confirmed") => {
    if (status === "confirmed") {
      setPaid(true);
    }
  };

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
              onStatusChange={handleStatus}
              quantity={quantity}
              poolId={pool.poolId}
            />
          </div>
        )}
        {paymentMethod === "usdc" && (
          <>
            {/*<div id="paymentUsdc-1" className="carousel-item relative w-full">*/}
            {/*  <StepPaymentUsdc1*/}
            {/*    onProtocolChange={(network) => setUsdcProtocol(network)}*/}
            {/*    quantity={quantity}*/}
            {/*    poolId={pool.poolId}*/}
            {/*  />*/}
            {/*</div>*/}
            <div id="paymentUsdc-2" className="carousel-item relative w-full">
              <StepPaymentUsdc2
                quantity={quantity}
                poolId={pool.poolId}
                protocol={usdcProtocol}
              />
            </div>
            <div id="paymentUsdc-3" className="carousel-item relative w-full">
              <StepPaymentUsdc3
                onStatusChange={handleStatus}
                quantity={quantity}
                poolId={pool.poolId}
                protocol={usdcProtocol}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
