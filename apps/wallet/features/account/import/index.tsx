import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiUserAddLine,
  RiUserReceivedLine,
} from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import { generateMasterKeys } from "@signumjs/crypto";
import { Address } from "@signumjs/core";
import { useTranslation } from "next-i18next";
import { encrypt, stretchKey } from "@/app/sec";
import { useDispatch } from "react-redux";
import { accountActions } from "@/app/states/accountState";
import { useNotification } from "@/app/hooks/useNotification";
import {
  StepDefinePin,
  StepConfirm,
  StepImportSeed,
  StepSeeImportAccount,
} from "@/features/account/components/steps";
import { OnStepChangeArgs } from "@/features/account/types/onStepChangeArgs";
import { useAppContext } from "@/app/hooks/useAppContext";

enum Steps {
  DefinePin,
  ImportSeed,
  SeeAccount,
  Confirm,
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountImport: FC<Props> = ({ onStepChange }) => {
  const StepCount = 4;
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { Ledger } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [seed, setSeed] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const nextStep = async () => {
    const newStep = Math.min(currentStep + 1, StepCount - 1);
    setCurrentStep(newStep);
    router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const previousStep = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  useEffect(() => {
    let canProceed = true;

    if (currentStep === Steps.DefinePin) {
      canProceed = pin.length > 4;
    } else if (currentStep === Steps.Confirm) {
      canProceed = isConfirmed;
    }

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === StepCount - 1;

    const bottomNav: BottomNavigationItem[] = [
      {
        label: !isFirstStep ? t("back") : "",
        onClick: !isFirstStep ? previousStep : voidFn,
        icon: !isFirstStep ? <RiArrowLeftCircleLine /> : <div />,
        disabled: isFirstStep,
      },
      {
        onClick: voidFn,
        icon: <div />,
        disabled: true,
        label: "",
      },
      {
        label: !isLastStep ? t("next") : t("import_account"),
        onClick: !isLastStep ? nextStep : createAccount,
        disabled: !canProceed,
        color: isLastStep ? "secondary" : undefined,
        loading: isCreating,
        icon: !isLastStep ? <RiArrowRightCircleLine /> : <RiUserReceivedLine />,
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [currentStep, pin, isConfirmed, isCreating]);

  async function createAccount() {
    try {
      setIsCreating(true);
      const keys = generateMasterKeys(seed);
      const { salt, key } = await stretchKey(pin);
      const securedKeys = await encrypt(key, JSON.stringify(keys));
      dispatch(
        accountActions.setAccount({
          accountId: Address.fromPublicKey(keys.publicKey).getNumericId(),
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
          onClick: voidFn,
          label: "",
          icon: <div />,
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
    if (!seed) return;

    const { publicKey } = generateMasterKeys(seed);

    try {
      const address = Address.fromPublicKey(publicKey, Ledger.AddressPrefix);
      setAccountAddress(address.getReedSolomonAddress());
    } catch (e: any) {
      console.error("Something failed", e.message);
    }
  }, [Ledger.AddressPrefix, seed]);

  return (
    <>
      <div className="mt-4">
        <Stepper currentStep={currentStep} steps={StepCount}></Stepper>
        <div className="carousel w-full touch-none">
          <div id="step0" className="carousel-item relative w-full">
            <StepDefinePin onPinChange={setPin} />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <StepImportSeed onSeedChange={setSeed} />
          </div>
          <div id="step2" className="carousel-item relative w-full">
            <StepSeeImportAccount account={accountAddress} />
          </div>
          <div id="step3" className="carousel-item relative w-full">
            <StepConfirm pin={pin} onConfirmationChange={setIsConfirmed} />
          </div>
        </div>
      </div>
    </>
  );
};
