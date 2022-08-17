import { Stepper } from "@/app/components/stepper";
import { FC, useEffect, useMemo, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiUserAddLine,
} from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import {
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
} from "@/features/account/creation/steps";
import { generateMasterKeys, PassPhraseGenerator } from "@signumjs/crypto";
import { Address } from "@signumjs/core";
import { useTranslation } from "next-i18next";

enum Steps {
  DefinePin,
  SeeAccount,
  GetSeed,
  VerifySeed,
  Confirm,
}

export interface OnStepChangeArgs {
  steps: number;
  currentStep: number;
  bottomNav: BottomNavigationItem[];
}

interface Props {
  onStepChange: (args: OnStepChangeArgs) => void;
}

export const AccountCreation: FC<Props> = ({ onStepChange }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const StepCount = 5;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [seed, setSeed] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

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
        icon: <div>Regenerate</div>,
      },
      "2": {
        label: "Download",
        onClick: download,
        icon: <div>Download</div>,
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

    const bottomNav: BottomNavigationItem[] = [
      {
        label: currentStep > 0 ? t("back") : "",
        onClick: currentStep > 0 ? previousStep : voidFn,
        icon: currentStep > 0 ? <RiArrowLeftCircleLine /> : <div />,
        disabled: currentStep <= 0,
      },
      menuMiddleMap[currentStep] || EmptyItem,
      {
        label: currentStep < StepCount ? t("next") : t("create_account"),
        onClick: currentStep < StepCount - 1 ? nextStep : createAccount,
        disabled: !canProceed,
        icon:
          currentStep < StepCount - 1 ? (
            <RiArrowRightCircleLine />
          ) : (
            <RiUserAddLine />
          ),
      },
    ];
    onStepChange({ steps: StepCount, currentStep, bottomNav });
  }, [currentStep, isVerified, pin, isConfirmed]);

  async function generateSeed() {
    const arr = new Uint8Array(128);
    crypto.getRandomValues(arr);
    const generator = new PassPhraseGenerator();
    const words = await generator.generatePassPhrase(Array.from(arr));
    setSeed(words.join(" "));
  }

  async function download() {
    console.log("Save");
  }

  async function createAccount() {
    console.log("Create account");
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

    generateSeed();
  }, []);

  useEffect(() => {
    if (!seed) return;

    const { publicKey } = generateMasterKeys(seed);

    try {
      const address = Address.fromPublicKey(publicKey);
      setAccountAddress(address.getReedSolomonAddress());
    } catch (e: any) {
      console.error("Something failed", e.message);
    }
  }, [seed]);

  return (
    <>
      <div className="mt-4">
        <Stepper currentStep={currentStep} steps={StepCount}></Stepper>
        <div className="carousel w-full touch-none">
          <div id="step0" className="carousel-item relative w-full">
            <StepOne onPinChange={setPin} />
          </div>
          <div id="step1" className="carousel-item relative w-full">
            <StepTwo account={accountAddress} />
          </div>
          <div id="step2" className="carousel-item relative w-full">
            <StepThree seed={seed} />
          </div>
          <div id="step3" className="carousel-item relative w-full">
            <StepFour seed={seed} onVerificationChange={setIsVerified} />
          </div>
          <div id="step4" className="carousel-item relative w-full">
            <StepFive
              seed={seed}
              pin={pin}
              onConfirmationChange={setIsConfirmed}
            />
          </div>
        </div>
      </div>
    </>
  );
};
