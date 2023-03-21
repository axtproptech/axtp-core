import { useTranslation } from "next-i18next";
import { FC } from "react";
import { HintBox } from "@/app/components/hintBox";
import { CustomerSafeData } from "@/types/customerSafeData";
import * as React from "react";
import { AnimatedIconConfetti } from "@/app/components/animatedIcons/animatedIconConfetti";
import { AnimatedIconWarn } from "@/app/components/animatedIcons/animatedIconWarn";

interface Props {
  customer?: CustomerSafeData;
}
export const StepCheckForRegistry: FC<Props> = ({ customer }) => {
  return customer ? (
    <HasCustomerDataView customer={customer} />
  ) : (
    <HasNoCustomerDataView />
  );
};

const HasCustomerDataView: FC<Props> = ({ customer }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("kyc_registry_found")}</h2>
      </section>
      <section>
        <HintBox
          text={t("kyc_registry_found_hint", { name: customer?.firstName })}
        >
          <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
            <AnimatedIconConfetti loopDelay={5000} touchable />
          </div>
        </HintBox>
      </section>
      <section className="relative mt-[15%] mb-2"></section>
    </div>
  );
};

const HasNoCustomerDataView = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("kyc-not-registered")}</h2>
      </section>
      <section>
        <HintBox text={t("kyc-not-registered-next")}>
          <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
            <AnimatedIconWarn loopDelay={5000} touchable />
          </div>
        </HintBox>
      </section>
      <section className="relative mt-[15%] mb-2"></section>
    </div>
  );
};
