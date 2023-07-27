import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { PoolHeader } from "../components/poolHeader";
import { useTranslation } from "next-i18next";
import { Stepper } from "@/app/components/stepper";
import {
  PaymentMethod,
  StepPaymentPix,
  StepPaymentUsdc1,
  StepPaymentUsdc2,
  StepPaymentUsdc3,
  StepSelectPaymentMethod,
  StepSelectQuantity,
} from "./steps";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
  RiWallet3Line,
} from "react-icons/ri";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { useAccount } from "@/app/hooks/useAccount";
import { ChainValue } from "@signumjs/util";
import { IfEligibleForAcquisition } from "./ifEligibleForAcquisition";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { StepConfirmTerms } from "@/features/pool/acquisition/steps/stepConfirmTerms";

// const StepRoutes = {
//   pix: ["quantity", "paymentMethod", "paymentPix"],
//   usdc: [
//     "quantity",
//     "paymentMethod",
//     "paymentUsdc-1",
//     "paymentUsdc-2",
//     "paymentUsdc-3",
//   ],
// };
const StepRoutes = {
  pix: ["terms", "quantity", "paymentPix"],
  usdc: [
    "terms",
    "quantity",
    "paymentUsdc-1",
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
  const { accountData } = useAccount();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const [stepCount, setStepCount] = useState<number>(StepRoutes["pix"].length);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [termsConfirmed, setTermsConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");

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

  const soldTokens = parseFloat(pool.token.supply);
  const availableShares = Math.max(pool.maxShareQuantity - soldTokens, 0);
  const maxAllowedShares = useMemo(() => {
    const poolBalance = accountData.balancesPools.find(
      (p) => p.id === pool.token.id
    );

    const maxTokenPerCustomer = Math.min(
      availableShares,
      pool.aliasData.maximumTokensPerCustomer
    );

    if (!poolBalance) return maxTokenPerCustomer;

    const customerHoldings = parseFloat(
      ChainValue.create(poolBalance.decimals)
        .setAtomic(poolBalance.quantity)
        .getCompound()
    );
    return Math.max(maxTokenPerCustomer - customerHoldings, 0);
  }, [availableShares, accountData, pool]);

  useEffect(() => {
    let canProceed = maxAllowedShares > 0;

    if (StepRoutes[paymentMethod][currentStep] === "quantity") {
      canProceed = quantity > 0 && quantity <= maxAllowedShares;
    }
    if (StepRoutes[paymentMethod][currentStep] === "terms") {
      canProceed = termsConfirmed;
    }

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
  }, [
    currentStep,
    maxAllowedShares,
    paid,
    quantity,
    stepCount,
    termsConfirmed,
  ]); // keep this, or you have a dead loop here

  useEffect(() => {
    setStepCount(StepRoutes[paymentMethod].length);
  }, [paymentMethod]);

  const handleStatus = (status: "pending" | "confirmed") => {
    if (status === "confirmed") {
      setPaid(true);
    }
  };

  if (!pool) return null;

  if (availableShares === 0) {
    return (
      <div className="overflow-hidden">
        <PoolHeader poolData={pool} />
        <section className="mt-[25%]">
          <HintBox text={t("sold_out")}>
            <div className="absolute w-[64px] top-[-48px] bg-base-100">
              <AnimatedIconCoins loopDelay={5000} touchable />
            </div>
            <p>{t("sold_out_hint")}</p>
          </HintBox>
        </section>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <PoolHeader poolData={pool} />
      <IfEligibleForAcquisition>
        <Stepper currentStep={currentStep} steps={stepCount} />
        <div
          className="carousel w-full overflow-x-hidden"
          onTouchMove={(e) => e.preventDefault()}
        >
          <div id="terms" className="carousel-item relative w-full">
            <StepConfirmTerms
              onConfirmChange={(confirmed) => setTermsConfirmed(confirmed)}
              poolName={pool.token.name}
            />
          </div>
          <div id="quantity" className="carousel-item relative w-full">
            <StepSelectQuantity
              onQuantityChange={(q) => setQuantity(q)}
              maxAllowedShares={maxAllowedShares}
              poolId={pool.poolId}
            />
          </div>
          {/*<div id="paymentMethod" className="carousel-item relative w-full">*/}
          {/*  <StepSelectPaymentMethod*/}
          {/*    onMethodChange={(m) => setPaymentMethod(m)}*/}
          {/*  />*/}
          {/*</div>*/}
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
              <div id="paymentUsdc-1" className="carousel-item relative w-full">
                <StepPaymentUsdc1
                  onProtocolChange={(network) => setUsdcProtocol(network)}
                  quantity={quantity}
                  poolId={pool.poolId}
                />
              </div>
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
      </IfEligibleForAcquisition>
    </div>
  );
};
