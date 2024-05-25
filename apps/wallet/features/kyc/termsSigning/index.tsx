import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { validatePixKey } from "@axtp/core";
import { PasteButton } from "@/app/components/buttons/pasteButton";
import { useRouter } from "next/router";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiCheckboxCircleLine,
  RiHome6Line,
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
import { Stepper } from "@/app/components/stepper";
import {
  StepDefinePin,
  StepImportSeed,
} from "@/features/account/components/steps";
import { StepCheckForRegistry } from "@/features/account/components/steps/stepCheckForRegistry";
import { StepIntro } from "./steps/stepIntro";
import { StepDocument } from "./steps/stepDocument";
import { StepSign } from "./steps/stepSign";
import { SignableDocument } from "../types/signableDocument";
import { SignedDocumentType } from "@/types/signedDocumentType";

interface Props {
  onNavChange: (bottomNav: BottomNavigationItem[]) => void;
}

const querySchema = object({
  reason: string().required(),
  type: mixed().oneOf(Object.values(SignedDocumentType)).required(),
  redirect: string().required(),
  poolId: string().optional(),
});

export const DocumentSigning = ({ onNavChange }: Props) => {
  const { t } = useTranslation();
  const { customer } = useAccount();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const { KycService } = useAppContext();
  const StepCount = 3;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [readDocument, setReadDocument] = useState<SignableDocument | null>(
    null
  );
  const [hasSigned, setHasSigned] = useState(false);

  const { mutate } = useSWRConfig();

  let params;
  try {
    params = querySchema.validateSync(router.query);
  } catch (e: any) {
    console.error("Invalid query params", e.message);
    router.replace("/");
  }

  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, StepCount - 1);
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const previousStep = async () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const signDocument = useCallback(async () => {
    if (!customer) return;
    try {
      setIsSaving(true);
      // TODO:....
      // const { pixKey } = getValues();
      // await KycService.storeSignedDocument(customer.customerId, pixKey, "Pix");
      // await mutate(`/fetchCustomer/${customer.customerId}`);
      // if (query.redirect) {
      //   await replace(query.redirect as string);
      // }
      showSuccess(t("kyc-banking-info-saved"));
    } catch (e: any) {
      showError(t("kyc-banking-info-save-error"));
    } finally {
      setIsSaving(false);
    }
  }, [router.query.redirect, router.replace]);

  useEffect(() => {
    const middleButton: BottomNavigationItem = {
      label: "",
      disabled: true,
      hideLabel: true,
      onClick: voidFn,
      icon: <></>,
    };

    if (currentStep === 0) {
      onNavChange([
        {
          route: "/",
          label: t("home"),
          icon: <RiHome6Line />,
        },
        middleButton,
        {
          label: t("next"),
          icon: <RiArrowRightCircleLine />,
          color: "secondary",
          disabled: false,
          onClick: nextStep,
        },
      ]);
    } else if (currentStep === 1) {
      onNavChange([
        {
          label: t("back"),
          icon: <RiArrowLeftCircleLine />,
          back: false,
          onClick: previousStep,
        },
        middleButton,
        {
          label: t("next"),
          icon: <RiArrowRightCircleLine />,
          color: "secondary",
          disabled: !readDocument,
          onClick: nextStep,
        },
      ]);
    } else if (currentStep === 2) {
      onNavChange([
        {
          label: t("back"),
          icon: <RiArrowLeftCircleLine />,
          back: false,
          onClick: previousStep,
        },
        middleButton,
        {
          label: t("next"),
          icon: <RiCheckboxCircleLine />,
          color: "secondary",
          disabled: !hasSigned,
          onClick: nextStep,
        },
      ]);
    }
  }, [currentStep, isSaving, readDocument, hasSigned, onNavChange, t]);

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <div className="mt-4">
        <Stepper currentStep={currentStep} steps={StepCount}></Stepper>
        <div className="carousel w-full overflow-x-hidden">
          <div id="step0" className="carousel-item relative w-full">
            <StepIntro />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <StepDocument
              onRead={setReadDocument}
              documentType={params?.type}
            />
          </div>
          <div id="step2" className="carousel-item relative w-full">
            <StepSign
              document={readDocument}
              onSigned={() => setHasSigned(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
