import { FC } from "react";
import { useTranslation } from "next-i18next";
import { CustomerSafeData } from "@/types/customerSafeData";
import { Address } from "@signumjs/core";
import { AttentionSeeker, Fade, Slide, Zoom } from "react-awesome-reveal";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { AnimatedIconConfetti } from "@/app/components/animatedIcons/animatedIconConfetti";
import * as React from "react";
import { useRouter } from "next/router";
import { RiCheckboxCircleLine } from "react-icons/ri";

interface Props {
  token: string;
  amount: string;
  currency: string;
}
export const WithdrawalSuccess = ({ token, amount, currency }: Props) => {
  const { t } = useTranslation("withdrawal");
  return (
    <div className="flex flex-col text-center h-[80vh] justify-center items-center relative w-full mx-auto">
      <section className="my-4">
        <AttentionSeeker effect="tada" className="text-center">
          <RiCheckboxCircleLine
            size={128}
            className="w-full"
            color="lightgreen"
          />
        </AttentionSeeker>
      </section>
      <Fade triggerOnce>
        <section>
          <HintBox>
            <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
              <AnimatedIconConfetti loopDelay={2500} touchable />
            </div>
            <h2 className="text-xl font-bold my-1 text-center">
              {t("success_hint")}
            </h2>
            <div className="prose">
              <p>{t("success_description", { token, amount, currency })}</p>
            </div>
          </HintBox>
        </section>
      </Fade>
    </div>
  );
};
