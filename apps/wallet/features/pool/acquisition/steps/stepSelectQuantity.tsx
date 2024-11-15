import { useTranslation } from "next-i18next";
import { useEffect, useMemo } from "react";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { Numeric } from "@/app/components/numeric";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { ChainValue } from "@signumjs/util";
import { selectPoolContractState } from "@/app/states/poolsState";
import { useAccount } from "@/app/hooks/useAccount";
import { FormWizardStepProps } from "@/app/components/formWizard";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { useRouter } from "next/router";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
} from "react-icons/ri";
import { Fade } from "react-awesome-reveal";
import { AcquisitionFormData } from "../acquisitionFormData";

export const StepSelectQuantity = ({
  data: { poolId, quantity },
  nextStep,
  updateData,
}: FormWizardStepProps<AcquisitionFormData>) => {
  const { t } = useTranslation();
  const { accountData } = useAccount();
  const router = useRouter();
  const { name } = useAppSelector(selectAXTToken);
  const pool = useAppSelector(selectPoolContractState(poolId));
  const { totalAXTC, totalBRL, adjustedBrlUsdPrice } = usePaymentCalculator(
    quantity,
    poolId
  );
  const { setNavItems } = useBottomNavigation();

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        onClick: () => router.back(),
        icon: <RiArrowLeftCircleLine />,
      },
      {
        route: "/",
        icon: <RiHome6Line />,
        label: t("home"),
      },
      {
        label: t("next"),
        onClick: nextStep,
        icon: <RiArrowRightCircleLine />,
      },
    ]);
  }, []);

  const soldTokens = Number(pool.token.supply);
  const availableShares = Math.max(pool.maxShareQuantity - soldTokens, 0);

  // Check how many shares can be acquired
  const maxAllowedShares = useMemo(() => {
    const poolBalance = accountData.balancesPools.find(
      (p) => p.id === pool.token.id
    );

    const maxTokenPerCustomer = Math.min(
      availableShares,
      pool.aliasData.maximumTokensPerCustomer
    );

    if (!poolBalance) return maxTokenPerCustomer;

    const customerHoldings = Number(
      ChainValue.create(poolBalance.decimals)
        .setAtomic(poolBalance.quantity)
        .getCompound()
    );
    return Math.max(maxTokenPerCustomer - customerHoldings, 0);
  }, [availableShares, accountData, pool]);

  if (maxAllowedShares === 0 || availableShares === 0) {
    const message =
      maxAllowedShares === 0 ? t("max_token_reached_hint") : t("sold_out_hint");
    return (
      <div className="overflow-hidden">
        <section className="mt-[25%] px-2">
          <HintBox text={t("max_token_reached")}>
            <div className="absolute w-[64px] top-[-48px] bg-base-100">
              <AnimatedIconCoins loopDelay={5000} touchable />
            </div>
            <p>{message}</p>
          </HintBox>
        </section>
      </div>
    );
  }

  return (
    <Fade className="opacity-0">
      <div className="flex flex-col justify-between h-[50vh] text-center relative prose w-full mx-auto px-2">
        <section className="mt-8">
          <h2 className="my-1">{t("acquire_token")}</h2>
          <h4 className="mb-8">{t("acquire_how_many")}</h4>
        </section>
        <section>
          <div className="relative flex flex-col mx-auto">
            <div className="btn-group mx-auto">
              {Array.from({ length: maxAllowedShares }).map((_, i) => {
                const q = i + 1;
                return (
                  <button
                    key={`btn-${q}}`}
                    className={`btn ${q === quantity ? "btn-active" : ""}`}
                    onClick={() => updateData("quantity", q)}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        <section>
          <HintBox>
            <div className="absolute w-[64px] top-[-48px] bg-base-100">
              <AnimatedIconCoins loopDelay={5000} touchable />
            </div>
            <div className="text-lg text-center">
              <h4 className="m-0 mb-1">{t("acquire_totalPrice")}</h4>
              <h4>
                <Numeric value={totalAXTC} suffix={name} /> ={" "}
                <Numeric value={totalAXTC} suffix="USD" /> ={" "}
                <Numeric value={totalBRL} suffix="BRL" />
              </h4>
              <small>
                {`${t("effective_rate")} - 1 USD :`}
                &nbsp;
                <Numeric value={adjustedBrlUsdPrice} suffix="BRL" />
              </small>
            </div>
          </HintBox>
        </section>
      </div>
    </Fade>
  );
};
