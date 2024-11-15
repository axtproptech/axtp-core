import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useMemo } from "react";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import * as React from "react";
import { AttentionSeeker, Fade } from "react-awesome-reveal";
import { FormWizardStepProps } from "@/app/components/formWizard";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
} from "react-icons/ri";
import { AcquisitionFormData } from "../acquisitionFormData";

export const StepSelectPaymentMethod = ({
  nextStep,
  previousStep,
  data,
  updateData,
}: FormWizardStepProps<AcquisitionFormData>) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();
  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        onClick: previousStep,
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

  const handleMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateData("paymentMethod", e.target.name);
  };

  const icon = useMemo(() => {
    switch (data.paymentMethod) {
      case "usdc":
        return (
          <img
            className="m-2 h-[32px]"
            src="/assets/img/usd-coin-logo.svg"
            alt="USDC Logo"
          />
        );
      case "pix":
        return (
          <img
            className="m-2 h-[32px]"
            src="/assets/img/pix-logo.svg"
            alt="PIX Logo"
          />
        );
      default:
    }
  }, [data.paymentMethod]);

  return (
    <Fade className="opacity-0">
      <div className="flex flex-col justify-between text-center relative prose w-full mx-auto px-2">
        <section className="mt-8">
          <h2 className="my-1">{t("acquire_select_method")}</h2>
        </section>
        <section className="h-[50vh] px-2">
          <div className="relative flex flex-col mx-auto w-1/4 mb-8">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="text-lg">PIX</span>
                <input
                  type="radio"
                  className="radio"
                  name="pix"
                  checked={data.paymentMethod === "pix"}
                  onChange={handleMethodChange}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="text-lg">USDC</span>
                <input
                  type="radio"
                  className="radio"
                  name="usdc"
                  checked={data.paymentMethod === "usdc"}
                  onChange={handleMethodChange}
                />
              </label>
            </div>
          </div>
          <HintBox text={t(`acquire_method_${data.paymentMethod}`)}>
            <div className="absolute top-[-24px] bg-base-100">
              <AttentionSeeker effect="heartBeat" delay={2000}>
                {icon}
              </AttentionSeeker>
            </div>
          </HintBox>
        </section>
        <section />
      </div>
    </Fade>
  );
};
