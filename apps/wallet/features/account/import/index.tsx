import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
  RiSurveyLine,
  RiUserReceivedLine,
} from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import { generateMasterKeys } from "@signumjs/crypto";
import { useTranslation } from "next-i18next";
import { encrypt, stretchKey } from "@/app/sec";
import { useDispatch } from "react-redux";
import { accountActions } from "@/app/states/accountState";
import { useNotification } from "@/app/hooks/useNotification";
import {
  StepDefinePin,
  StepImportSeed,
} from "@/features/account/components/steps";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";
import { useAppContext } from "@/app/hooks/useAppContext";
import { StepCheckForRegistry } from "@/features/account/components/steps/stepCheckForRegistry";
import useSWR from "swr";

enum Steps {
  DefinePin,
  ImportSeed,
  CheckRegistry,
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountImport: FC<Props> = ({ onStepChange }) => {
  const StepCount = 3;
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { Ledger, KycService } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [seed, setSeed] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [accountPublicKey, setAccountPublicKey] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const { data: customerData } = useSWR(
    accountPublicKey
      ? `fetchCustomerDataByPublicKey/${accountPublicKey}`
      : null,
    async () => {
      try {
        if (!accountPublicKey) return undefined;
        return await KycService.fetchCustomerDataByPublicKey(accountPublicKey);
      } catch (e: any) {
        return undefined;
      }
    }
  );

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

  const navigateRegisterAccount = async () => {
    await createAccount();
    await router.push(`/kyc/registry`);
  };

  useEffect(() => {
    let canProceed = true;

    if (currentStep === Steps.DefinePin) {
      canProceed = pin.length >= 5;
    } else if (currentStep === Steps.ImportSeed) {
      canProceed = seed.length > 0;
    }

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === StepCount - 1;
    let rightSideIcon = <RiArrowRightCircleLine />;
    let rightSideLabel = t("next");
    let rightSideAction = nextStep;
    if (isLastStep) {
      if (Boolean(customerData)) {
        rightSideIcon = <RiUserReceivedLine />;
        rightSideLabel = t("import_account");
        rightSideAction = createAccount;
      } else {
        rightSideIcon = <RiSurveyLine />;
        rightSideLabel = t("register_customer");
        rightSideAction = navigateRegisterAccount;
      }
    }

    const bottomNav: BottomNavigationItem[] = [
      {
        label: !isFirstStep ? t("back") : t("home"),
        onClick: !isFirstStep ? previousStep : navigateHome,
        icon: !isFirstStep ? <RiArrowLeftCircleLine /> : <RiHome6Line />,
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
        loading: isCreating,
        icon: rightSideIcon,
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [currentStep, pin, customerData, isCreating, seed]);

  async function createAccount() {
    try {
      setIsCreating(true);
      const keys = generateMasterKeys(seed);
      const { salt, key } = await stretchKey(pin);
      const securedKeys = await encrypt(key, JSON.stringify(keys));
      if (customerData) {
        dispatch(accountActions.setCustomer(customerData));
      }

      dispatch(
        accountActions.setAccount({
          publicKey: keys.publicKey,
          securedKeys,
          salt,
        })
      );
      await router.replace("/");
      showSuccess(t("account_stored_success"));
    } catch (e: any) {
      showError(t("severe_error", { reason: e.message }));
      setIsCreating(false);
    }
  }

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

  useEffect(() => {
    if (!seed) {
      setAccountPublicKey("");
      return;
    }
    const { publicKey } = generateMasterKeys(seed);
    setAccountPublicKey(publicKey);
  }, [Ledger.AddressPrefix, seed]);

  return (
    <div className="mt-4">
      <Stepper currentStep={currentStep} steps={StepCount}></Stepper>
      <div className="carousel w-full overflow-x-hidden">
        <div id="step0" className="carousel-item relative w-full">
          <StepDefinePin onPinChange={setPin} />
        </div>
        <div id="step1" className="carousel-item relative w-full">
          <StepImportSeed onSeedChange={setSeed} publicKey={accountPublicKey} />
        </div>
        <div id="step2" className="carousel-item relative w-full">
          <StepCheckForRegistry customer={customerData} />
        </div>
      </div>
    </div>
  );
};
