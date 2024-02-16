import * as React from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { Stepper } from "@/app/components/stepper";
import { useStepper } from "@/app/hooks/useStepper";
import { Step1RegisterPixKey } from "@/features/account/withdrawal/components/steps/Step1RegisterPixKey";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { FormProvider, useForm } from "react-hook-form";
import { WithdrawalFormData } from "@/features/account/withdrawal/types/withdrawalFormData";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
  RiSurveyLine,
  RiUserReceivedLine,
} from "react-icons/ri";
import { voidFn } from "@/app/voidFn";

const PaddingSize = 8;

interface Props {
  onNavChange: (nav: BottomNavigationItem[]) => void;
}
export const Withdrawal = ({ onNavChange }: Props) => {
  const { customer } = useAccount();
  const { t } = useTranslation();
  const hasBankInformation = customer?.hasBankInformation;
  const { currentStep, nextStep, previousStep, stepsCount } = useStepper(
    hasBankInformation ? 2 : 3
  );
  const formMethods = useForm<WithdrawalFormData>({
    mode: "onChange",
    defaultValues: {
      amount: 0,
      pinConfirmed: false,
      pixKey: "",
    },
  });

  const { watch } = formMethods;

  const pixKey = watch("pixKey");

  useEffect(() => {
    let canProceed = true;

    if (currentStep === 0) {
      canProceed = pixKey.length > 5;
    }
    // else if (currentStep === Steps.ImportSeed) {
    //     canProceed = seed.length > 0;
    // }

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === stepsCount - 1;
    let rightSideIcon = <RiArrowRightCircleLine />;
    let rightSideLabel = t("next");
    let rightSideAction = nextStep;
    if (isLastStep) {
      // if (Boolean(customerData)) {
      //     rightSideIcon = <RiUserReceivedLine />;
      //     rightSideLabel = t("import_account");
      //     rightSideAction = createAccount;
      // } else {
      //     rightSideIcon = <RiSurveyLine />;
      //     rightSideLabel = t("register_customer");
      //     rightSideAction = navigateRegisterAccount;
      // }
    }

    const bottomNav: BottomNavigationItem[] = [
      {
        label: t("back"),
        onClick: previousStep,
        icon: <RiArrowLeftCircleLine />,
        disabled: false,
      },
      {
        onClick: voidFn,
        icon: <div />,
        disabled: true,
        label: "",
      },
      {
        label: rightSideLabel,
        onClick: rightSideAction,
        disabled: !canProceed,
        color: canProceed ? "secondary" : undefined,
        // loading: isCreating,
        icon: rightSideIcon,
      },
    ];
    onNavChange(bottomNav);
  }, [pixKey]);

  return (
    <div className="mt-4">
      <Stepper currentStep={currentStep} steps={stepsCount} />
      <FormProvider {...formMethods}>
        <div className="carousel w-full overflow-x-hidden">
          {!hasBankInformation && (
            <div id="step0" className="carousel-item relative w-full">
              <Step1RegisterPixKey />
            </div>
          )}
          <div id="step1" className="carousel-item relative w-full">
            <h2>Step 2 - [Amount]</h2>
          </div>
          <div id="step2" className="carousel-item relative w-full">
            <h2>Step 3 - [PIN]</h2>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};
