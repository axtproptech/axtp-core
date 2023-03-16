import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
  RiUserAddLine,
} from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import {
  StepConfirm,
  StepVerifySeed,
  StepDefinePin,
  StepViewSeed,
  StepSeeNewAccount,
} from "../components/steps";
import { generateMasterKeys, PassPhraseGenerator } from "@signumjs/crypto";
import { Address } from "@signumjs/core";
import { useTranslation } from "next-i18next";
import { encrypt, stretchKey } from "@/app/sec";
import { useDispatch } from "react-redux";
import { accountActions } from "@/app/states/accountState";
import { useNotification } from "@/app/hooks/useNotification";
import { OnStepChangeArgs } from "@/types/onStepChangeArgs";
import { useAppContext } from "@/app/hooks/useAppContext";
import { PrintableSeedDocument } from "@/features/account/components/printableSeedDocument";

enum Steps {
  DefinePin,
  SeeAccount,
  GetSeed,
  VerifySeed,
  Confirm,
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountCreation: FC<Props> = ({ onStepChange }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const { Ledger, ActivationService } = useAppContext();
  const StepCount = 5;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [seed, setSeed] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

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

  useEffect(() => {
    const EmptyItem: BottomNavigationItem = {
      onClick: voidFn,
      icon: <div />,
      disabled: true,
      label: "",
    };

    const menuMiddleMap: any = {
      "1": {
        label: "Regenerate",
        onClick: generateSeed,
        icon: <div>{t("regenerate")}</div>,
      },
    };

    let canProceed = true;

    if (currentStep === Steps.DefinePin) {
      canProceed = pin.length > 4;
    } else if (currentStep === Steps.VerifySeed) {
      canProceed = isVerified;
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
      menuMiddleMap[currentStep] || EmptyItem,
      {
        label: !isLastStep ? t("next") : t("import_account"),
        onClick: !isLastStep ? nextStep : storeAccount,
        disabled: !canProceed,
        color: canProceed ? "secondary" : undefined,
        loading: isCreating,
        icon:
          currentStep < StepCount - 1 ? (
            <RiArrowRightCircleLine />
          ) : (
            <RiUserAddLine />
          ),
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [currentStep, isVerified, pin, isConfirmed, isCreating]);

  async function generateSeed() {
    const arr = new Uint8Array(128);
    crypto.getRandomValues(arr);
    const generator = new PassPhraseGenerator();
    const words = await generator.generatePassPhrase(Array.from(arr));
    setSeed(words.join(" "));
  }

  function handleDownload() {
    window.print();
  }

  async function storeAccount() {
    try {
      setIsCreating(true);
      const keys = generateMasterKeys(seed);
      const { salt, key } = await stretchKey(pin);
      const securedKeys = await encrypt(key, JSON.stringify(keys));
      const address = Address.fromPublicKey(keys.publicKey);
      await ActivationService.activate(address);
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
    const InitialBottomNav: BottomNavigationItem[] = [
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
    ];
    onStepChange({
      bottomNav: InitialBottomNav,
      currentStep: 0,
      steps: StepCount,
    });

    generateSeed();

    return () => {
      onStepChange({
        bottomNav: InitialBottomNav,
        currentStep: 0,
        steps: StepCount,
      });
    };
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
      <PrintableSeedDocument seed={seed} address={accountAddress} />
      <div className="print:hidden mt-4">
        <Stepper currentStep={currentStep} steps={StepCount} />
        <div className="carousel w-full mx-[2px] overflow-x-hidden">
          <div id="step0" className="carousel-item relative w-full">
            <StepDefinePin onPinChange={setPin} />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <StepSeeNewAccount account={accountAddress} />
          </div>
          <div id="step2" className="carousel-item relative w-full">
            <StepViewSeed seed={seed} onDownloadClick={handleDownload} />
          </div>
          <div id="step3" className="carousel-item relative w-full">
            <StepVerifySeed seed={seed} onVerificationChange={setIsVerified} />
          </div>
          <div id="step4" className="carousel-item relative w-full">
            <StepConfirm pin={pin} onConfirmationChange={setIsConfirmed} />
          </div>
        </div>
      </div>
    </>
  );
};
