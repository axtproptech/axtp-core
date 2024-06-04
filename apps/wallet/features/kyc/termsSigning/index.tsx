import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiCloseCircleLine,
  RiHome6Line,
} from "react-icons/ri";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { voidFn } from "@/app/voidFn";
import { mixed, object, string } from "yup";
import { Stepper } from "@/app/components/stepper";
import { StepIntro } from "./steps/stepIntro";
import { StepDocument } from "./steps/stepDocument";
import { StepSign } from "./steps/stepSign";
import { SignableDocument } from "../types/signableDocument";
import { SignedDocumentType } from "@/types/signedDocumentType";
import { useStepper } from "@/app/hooks/useStepper";

interface Props {
  onNavChange: (bottomNav: BottomNavigationItem[]) => void;
}

const querySchema = object({
  reason: string().required(),
  type: mixed().oneOf(Object.values(SignedDocumentType)).required(),
  redirect: string().required(),
  poolId: string().optional(),
});

export const TermsSigning = ({ onNavChange }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { previousStep, nextStep, currentStep, stepsCount } = useStepper(3);
  const [isSaving, setIsSaving] = useState(false);
  const [readDocument, setReadDocument] = useState<SignableDocument | null>(
    null
  );

  useEffect(() => {
    const emptyButton: BottomNavigationItem = {
      label: "",
      disabled: true,
      hideLabel: true,
      onClick: voidFn,
      icon: <></>,
    };

    const cancelButton: BottomNavigationItem = {
      route: "/",
      label: t("cancel"),
      icon: <RiCloseCircleLine />,
    };

    if (currentStep === 0) {
      onNavChange([
        {
          route: "/",
          label: t("home"),
          icon: <RiHome6Line />,
        },
        emptyButton,
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
        cancelButton,
        {
          label: t("next"),
          icon: <RiArrowRightCircleLine />,
          color: "secondary",
          disabled: !readDocument?.hasRead,
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
        cancelButton,
        emptyButton,
      ]);
    }
  }, [currentStep, isSaving, readDocument, onNavChange]);

  let params;
  try {
    params = querySchema.validateSync(router.query);
  } catch (e: any) {
    console.error("Invalid query params", e.message);
    router.replace("/");
    return null;
  }

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <div className="mt-4">
        <Stepper currentStep={currentStep} steps={stepsCount} />
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
              redirectUrl={params?.redirect || ""}
              poolId={params?.poolId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
