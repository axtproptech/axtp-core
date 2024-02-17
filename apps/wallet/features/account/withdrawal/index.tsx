import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { Stepper } from "@/app/components/stepper";
import { useStepper } from "@/app/hooks/useStepper";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { FormProvider, useForm } from "react-hook-form";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { WithdrawalFormData } from "./types/withdrawalFormData";
import { Step1WithdrawalAmount } from "@/features/account/withdrawal/components/steps/Step1WithdrawalAmount";

interface Props {
  onNavChange: (nav: BottomNavigationItem[]) => void;
}

enum WithdrawalSteps {
  Amount = 0,
  Confirmed,
}

export const Withdrawal = ({ onNavChange }: Props) => {
  const { customer } = useAccount();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentStep, nextStep, previousStep, stepsCount } = useStepper(2);
  const formMethods = useForm<WithdrawalFormData>({
    mode: "onChange",
    defaultValues: {
      amount: 0,
      pinConfirmed: false,
    },
  });

  const { watch } = formMethods;
  const amount = watch("amount");

  useEffect(() => {
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === stepsCount - 1;
    let canProceed = false;
    let rightSideIcon = <RiArrowRightCircleLine />;
    let rightSideLabel = t("next");
    let rightSideAction = nextStep;

    switch (currentStep) {
      case WithdrawalSteps.Amount: {
        canProceed = !formMethods.getFieldState("amount").invalid;
        break;
      }
      case WithdrawalSteps.Confirmed: {
        canProceed = !formMethods.getFieldState("pinConfirmed").invalid;
        break;
      }
    }

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
        disabled: isFirstStep,
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
        loading: isProcessing,
        icon: rightSideIcon,
      },
    ];
    onNavChange(bottomNav);
  }, [amount, currentStep, isProcessing]);

  return (
    <div className="mt-4">
      <Stepper currentStep={currentStep} steps={stepsCount} />
      <FormProvider {...formMethods}>
        <div className="carousel w-full overflow-x-hidden">
          <div id="step0" className="carousel-item relative w-full">
            <Step1WithdrawalAmount />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <h2>Step 2 - [PIN]</h2>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};
