import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { validatePixKey } from "@axtp/core";
import { PasteButton } from "@/app/components/buttons/pasteButton";
import { useRouter } from "next/router";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiSaveLine,
} from "react-icons/ri";
import { useAccount } from "@/app/hooks/useAccount";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useNotification } from "@/app/hooks/useNotification";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR, { useSWRConfig } from "swr";
import { voidFn } from "@/app/voidFn";
import { mixed, object, string } from "yup";
import { TermsOfRisk } from "@/features/kyc/documentSigning/docs/termsOfRisk";
import { Stepper } from "@/app/components/stepper";
import {
  StepDefinePin,
  StepImportSeed,
} from "@/features/account/components/steps";
import { StepCheckForRegistry } from "@/features/account/components/steps/stepCheckForRegistry";

export const StepIntro = () => {
  const { t } = useTranslation();
  const { customer } = useAccount();

  return (
    <section>
      <h2>{t("kyc-sign-document-title")}</h2>
      <p className="text-justify">
        {t("kyc-sign-document-intro", { name: customer?.firstName })}
      </p>
    </section>
  );
};
