import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
  RiSurveyLine,
  RiWallet3Line,
} from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { useNotification } from "@/app/hooks/useNotification";
import { useAppContext } from "@/app/hooks/useAppContext";
import { StepEnterCpf, StepConfirm } from "@/features/kyc/accountLinkage/steps";
import { CustomerSafeData } from "@/types/customerSafeData";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";
import { useAccount } from "@/app/hooks/useAccount";
import { accountActions } from "@/app/states/accountState";

enum Steps {
  EnterCpf,
  Confirm,
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountLinkage: FC<Props> = ({ onStepChange }) => {
  const StepCount = 2;
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { Ledger, KycService } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showRegistry, setShowRegistry] = useState<boolean>(false);
  const [customer, setCustomer] = useState<CustomerSafeData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { accountPublicKey } = useAccount();

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

  const navigateHome = async () => {
    await router.push(`/`);
  };

  const navigateRegistry = async () => {
    await router.replace(`/kyc/registry`);
  };

  const linkAccount = async () => {
    if (!customer) return;
    if (!accountPublicKey) return;
    if (customer.publicKey) {
      showError(t("kyc_cpf_has_pk"));
      navigateHome().then();
      return;
    }

    try {
      const updatedCustomer = await KycService.assignPublicKeyToCustomer(
        customer.customerId,
        accountPublicKey,
        Ledger.IsTestNet
      );

      dispatch(accountActions.setCustomer(updatedCustomer));
      showSuccess(t("kyc_account_linked_successfully"));
      setIsConfirmed(true);
      await router.replace("/account");
    } catch (e) {
      showError(t("kyc_account_linked_failed"));
    }
  };

  useEffect(() => {
    let canProceed = true;

    if (currentStep === Steps.EnterCpf) {
      canProceed = !!customer;
    } else if (currentStep === Steps.Confirm) {
      canProceed = isConfirmed;
    }

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === StepCount - 1;

    const bottomNav: BottomNavigationItem[] = [
      {
        label: !isFirstStep ? t("back") : t("home"),
        onClick: !isFirstStep ? previousStep : navigateHome,
        icon: !isFirstStep ? <RiArrowLeftCircleLine /> : <RiHome6Line />,
        disabled: false,
      },
      showRegistry
        ? {
            onClick: navigateRegistry,
            icon: <RiSurveyLine />,
            label: t("register_customer"),
          }
        : {
            onClick: voidFn,
            icon: <div />,
            disabled: true,
            label: "",
          },
      {
        label: !isLastStep ? t("next") : t("account"),
        onClick: !isLastStep ? nextStep : linkAccount,
        disabled: !canProceed,
        color: canProceed ? "secondary" : undefined,
        icon: !isLastStep ? <RiArrowRightCircleLine /> : <RiWallet3Line />,
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [currentStep, showRegistry, customer, isConfirmed]);

  useEffect(() => {
    onStepChange({
      bottomNav: [
        {
          onClick: navigateHome,
          label: t("home"),
          icon: <RiHome6Line />,
        },
        {
          onClick: voidFn,
          label: "",
          icon: <div />,
        },
        {
          onClick: nextStep,
          label: t("next"),
          icon: <RiArrowRightCircleLine />,
          disabled: true,
        },
      ],
      currentStep: 0,
      steps: StepCount,
    });
  }, []);

  return (
    <>
      <div className="mt-4">
        <Stepper currentStep={currentStep} steps={StepCount}></Stepper>
        <div className="carousel w-full overflow-x-hidden">
          <div id="step0" className="carousel-item relative w-full">
            <StepEnterCpf
              onCustomerChanged={setCustomer}
              onAllowRegistry={setShowRegistry}
            />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <StepConfirm onConfirmed={linkAccount} />
          </div>
        </div>
      </div>
    </>
  );
};
