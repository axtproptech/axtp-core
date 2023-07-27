// @ts-ignore
import JotForm from "jotform-react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { isIOS } from "mobile-device-detect";
import { AttentionSeeker, Fade, Slide } from "react-awesome-reveal";
import { PoolHeader } from "@/features/pool/components/poolHeader";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import * as React from "react";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import {
  RiGroupLine,
  RiLoginCircleFill,
  RiSurveyLine,
  RiUserAddLine,
  RiUserReceivedLine,
} from "react-icons/ri";
import Link from "next/link";
import { Glasscard } from "@/app/components/cards/glasscard";
import { MouseEvent, useEffect } from "react";
import { useRouter } from "next/router";

export const NewKYC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/kyc/registry");
    router.prefetch("/account/import");
  }, []);

  const handleCardClick = (route: string) => async (_: MouseEvent) => {
    await router.push(`${route}`);
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="flex flex-col md:flex-row">
        <Glasscard
          className="w-80"
          icon={
            <AttentionSeeker effect="tada">
              <RiSurveyLine size={32} />
            </AttentionSeeker>
          }
          title={t("register_customer")}
          text={t("register_customer_hint")}
          onClick={handleCardClick("/kyc/registry")}
        />
        <Glasscard
          className="mt-8 md:mt-0 md:ml-8 w-80"
          icon={
            <AttentionSeeker effect="tada" delay={500}>
              <RiUserReceivedLine size={32} />
            </AttentionSeeker>
          }
          title={t("import_account")}
          text={t("import_account_hint")}
          onClick={handleCardClick("/account/import")}
        />
      </div>
    </div>
  );
};
