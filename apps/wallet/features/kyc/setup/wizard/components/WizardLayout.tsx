import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ReactNode, useCallback, useMemo } from "react";
import { cpf } from "cpf-cnpj-validator";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiProfileFill,
} from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { voidFn } from "@/app/voidFn";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { Layout } from "@/app/components/layout";
import { Stepper } from "@/app/components/stepper";
import { PrintableSeedDocument } from "@/features/account/components/printableSeedDocument";
import { selectCurrentStep, selectInitialSetupStep } from "../../state";
import { KycWizard } from "../validation/types";
import { Steps, StepsCount } from "../../../types/steps";
import { kycActions } from "../../state";
import { FormProgressTracker } from "../../components/FormProgressTracker";

import differenceInYears from "date-fns/differenceInYears";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";

interface Props {
  children: ReactNode;
  isSubmitting: boolean;
}

export const WizardLayout = ({ children, isSubmitting }: Props) => {
  const { t } = useTranslation();
  const { Ledger } = useAppContext();

  const {
    setCurrentStep,
    setAgreeTerms,
    setSecondStep,
    setThirdStep,
    setFourthStep,
    setMotherDataStep,
    setDocumentStep,
  } = kycActions;
  const { firstName, lastName, email, code } = useAppSelector(
    selectInitialSetupStep
  );
  const currentStep = useAppSelector(selectCurrentStep);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    watch,
    formState: { errors },
  } = useFormContext<KycWizard>();

  const stepMovement = useCallback(
    async (newStep: Steps) => {
      dispatch(setCurrentStep(newStep));
      await router.push(`#step${newStep}`, `#step${newStep}`, {
        shallow: true,
      });
    },
    [dispatch, router, setCurrentStep]
  );

  const agreeTerms = watch("agreeTerms");
  const customerCpf = watch("cpf");
  const birthDate = watch("birthDate");
  const birthPlace = watch("birthPlace");
  const phone = watch("phone");
  const profession = watch("profession");
  const pep = watch("pep");
  const streetAddress = watch("streetAddress");
  const complementaryStreetAddress = watch("complementaryStreetAddress");
  const zipCode = watch("zipCode");
  const city = watch("city");
  const state = watch("state");
  const country = watch("country");
  const proofOfAddress = watch("proofOfAddress");
  const firstNameMother = watch("firstNameMother");
  const lastNameMother = watch("lastNameMother");
  const documentType = watch("documentType");
  const frontSide = watch("frontSide");
  const backSide = watch("backSide");
  const devicePin = watch("devicePin");
  const accountPublicKey = watch("accountPublicKey");
  const accountSeedPhrase = watch("accountSeedPhrase");
  const seedPhraseVerification = watch("seedPhraseVerification");
  const seedPhraseVerificationIndex = watch("seedPhraseVerificationIndex");
  const agreeSafetyTerms = watch("agreeSafetyTerms");

  const cpfFieldError = !!errors.cpf?.message;
  const birthDateFieldError = !!errors.birthDate?.message;
  const birthPlaceFieldError = !!errors.birthPlace?.message;
  const phoneFieldError = !!errors.phone?.message;
  const professionFieldError = !!errors.profession?.message;
  const streetAddressFieldError = !!errors.streetAddress?.message;
  const complementaryStreetAddressFieldError =
    !!errors.complementaryStreetAddress?.message;
  const zipCodeFieldError = !!errors.zipCode?.message;
  const cityFieldError = !!errors.city?.message;
  const stateFieldError = !!errors.state?.message;
  const countryFieldError = !!errors.country?.message;
  const proofOfAddressFieldError = !!errors.proofOfAddress?.message;
  const firstNameMotherFieldError = !!errors.firstNameMother?.message;
  const lastNameMotherFieldError = !!errors.lastNameMother?.message;

  const accountRS = accountPublicKey
    ? Address.fromPublicKey(
        accountPublicKey,
        Ledger.AddressPrefix
      ).getReedSolomonAddress()
    : "";

  let canMoveToNextStep = false;

  switch (currentStep) {
    case Steps.AgreeTerms:
      canMoveToNextStep = !!(
        agreeTerms &&
        firstName &&
        lastName &&
        email &&
        code
      );
      break;

    case Steps.BasicData:
      canMoveToNextStep = !!(
        customerCpf &&
        birthDate &&
        birthPlace &&
        !cpfFieldError &&
        !birthDateFieldError &&
        !birthPlaceFieldError
      );

      if (canMoveToNextStep) {
        // Custom CPF validation
        if (!cpf.isValid(`${customerCpf}`)) {
          canMoveToNextStep = false;
        }

        // Custom Birth Date Validation
        const currentDate = new Date();
        const formattedBirthDate = new Date(birthDate);

        if (differenceInYears(currentDate, formattedBirthDate) < 18) {
          canMoveToNextStep = false;
        }
      }
      break;

    case Steps.ComplementaryData:
      canMoveToNextStep = !!(
        phone &&
        profession &&
        !phoneFieldError &&
        !professionFieldError
      );
      break;

    case Steps.ResidencyData:
      canMoveToNextStep = !!(
        streetAddress &&
        zipCode &&
        city &&
        state &&
        proofOfAddress &&
        !streetAddressFieldError &&
        !complementaryStreetAddressFieldError &&
        !zipCodeFieldError &&
        !cityFieldError &&
        !stateFieldError &&
        !countryFieldError &&
        !proofOfAddressFieldError
      );
      break;

    case Steps.MotherData:
      canMoveToNextStep = !!(
        firstNameMother &&
        lastNameMother &&
        !firstNameMotherFieldError &&
        !lastNameMotherFieldError
      );
      break;

    case Steps.DocumentFiles:
      canMoveToNextStep = !!(documentType && frontSide);
      break;

    case Steps.BlockchainAccountSetup:
      canMoveToNextStep = !!(
        accountPublicKey &&
        accountSeedPhrase &&
        devicePin.length >= 5 &&
        devicePin.length <= 9
      );
      break;

    case Steps.BlockchainAccountSeed:
      canMoveToNextStep = true;
      break;

    case Steps.BlockchainAccountSeedVerification:
      if (
        accountSeedPhrase &&
        seedPhraseVerification &&
        seedPhraseVerificationIndex
      ) {
        const seedArray = ["", ...accountSeedPhrase.split(" ")];

        const selectedWord = seedArray[seedPhraseVerificationIndex] || "";

        canMoveToNextStep = !!(
          agreeSafetyTerms &&
          selectedWord &&
          selectedWord === seedPhraseVerification
        );
      }

      break;

    default:
      break;
  }

  const handleBackButton = useCallback(() => {
    switch (currentStep) {
      case Steps.AgreeTerms:
        router.replace("/kyc");
        break;

      case Steps.BasicData:
        stepMovement(Steps.AgreeTerms);
        break;

      case Steps.ComplementaryData:
        stepMovement(Steps.BasicData);
        break;

      case Steps.ResidencyData:
        stepMovement(Steps.ComplementaryData);
        break;

      case Steps.MotherData:
        stepMovement(Steps.ResidencyData);
        break;

      case Steps.DocumentFiles:
        stepMovement(Steps.MotherData);
        break;

      case Steps.BlockchainAccountSetup:
        stepMovement(Steps.DocumentFiles);
        break;

      case Steps.BlockchainAccountSeed:
        stepMovement(Steps.BlockchainAccountSetup);
        break;

      case Steps.BlockchainAccountSeedVerification:
        stepMovement(Steps.BlockchainAccountSeed);
        break;

      default:
        break;
    }
  }, [currentStep, router, stepMovement]);

  const handleNextButton = useCallback(async () => {
    switch (currentStep) {
      case Steps.AgreeTerms:
        dispatch(setAgreeTerms(agreeTerms));
        await stepMovement(Steps.BasicData);
        break;

      case Steps.BasicData:
        dispatch(setSecondStep({ cpf: customerCpf, birthDate, birthPlace }));
        await stepMovement(Steps.ComplementaryData);
        break;

      case Steps.ComplementaryData:
        dispatch(setThirdStep({ phone, profession, pep }));
        await stepMovement(Steps.ResidencyData);
        break;

      case Steps.ResidencyData:
        dispatch(
          setFourthStep({
            streetAddress,
            complementaryStreetAddress,
            zipCode,
            city,
            state,
            country,
            proofOfAddress,
          })
        );
        await stepMovement(Steps.MotherData);
        break;

      case Steps.MotherData:
        dispatch(
          setMotherDataStep({
            firstNameMother: firstNameMother,
            lastNameMother: lastNameMother,
          })
        );
        await stepMovement(Steps.DocumentFiles);
        break;

      case Steps.DocumentFiles:
        dispatch(setDocumentStep({ documentType, frontSide, backSide }));
        await stepMovement(Steps.BlockchainAccountSetup);
        break;

      case Steps.BlockchainAccountSetup:
        await stepMovement(Steps.BlockchainAccountSeed);
        break;

      case Steps.BlockchainAccountSeed:
        await stepMovement(Steps.BlockchainAccountSeedVerification);
        break;

      default:
        break;
    }
  }, [
    dispatch,
    stepMovement,
    setAgreeTerms,
    setSecondStep,
    setThirdStep,
    setFourthStep,
    setMotherDataStep,
    setDocumentStep,
    currentStep,
    agreeTerms,
    customerCpf,
    birthDate,
    birthPlace,
    phone,
    profession,
    pep,
    streetAddress,
    complementaryStreetAddress,
    zipCode,
    city,
    state,
    country,
    proofOfAddress,
    firstNameMother,
    lastNameMother,
    documentType,
    frontSide,
    backSide,
  ]);

  const bottomNav: BottomNavigationItem[] = useMemo(
    () => [
      {
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        onClick: handleBackButton,
        type: "button",
      },
      {
        onClick: voidFn,
        label: "",
        type: "button",
        icon: <div />,
      },
      {
        label: t(
          currentStep === Steps.BlockchainAccountSeedVerification
            ? "submit"
            : "next"
        ),
        icon:
          currentStep === Steps.BlockchainAccountSeedVerification ? (
            <RiProfileFill />
          ) : (
            <RiArrowRightCircleLine />
          ),
        onClick: handleNextButton,
        type:
          currentStep === Steps.BlockchainAccountSeedVerification
            ? "submit"
            : "button",
        color:
          currentStep === Steps.BlockchainAccountSeedVerification
            ? "accent"
            : "secondary",
        disabled: !canMoveToNextStep,
        loading: isSubmitting,
      },
    ],
    [
      canMoveToNextStep,
      currentStep,
      handleBackButton,
      handleNextButton,
      t,
      isSubmitting,
    ]
  );

  return (
    <>
      <PrintableSeedDocument seed={accountSeedPhrase} address={accountRS} />

      <FormProgressTracker />

      <Layout bottomNav={bottomNav}>
        <div className="print:hidden mt-4">
          <Stepper currentStep={currentStep} steps={StepsCount} />
          {children}
        </div>
      </Layout>
    </>
  );
};
