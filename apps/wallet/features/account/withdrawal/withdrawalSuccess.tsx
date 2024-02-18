import { FC } from "react";
import { useTranslation } from "next-i18next";
import { CustomerSafeData } from "@/types/customerSafeData";
import { Address } from "@signumjs/core";
import { Slide, Zoom } from "react-awesome-reveal";

export const WithdrawalSuccess = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col text-center h-[80vh] justify-center items-center relative prose w-full mx-auto">
      <Slide triggerOnce direction="up">
        <section className="px-4">
          <p className="text-justify">{t("register_description")}</p>
        </section>
      </Slide>
    </div>
  );
};
