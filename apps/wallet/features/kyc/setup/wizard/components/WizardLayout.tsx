import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ReactNode, useCallback } from "react";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { voidFn } from "@/app/voidFn";
import { Layout } from "@/app/components/layout";
import { Stepper } from "@/app/components/stepper";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { PrintableSeedDocument } from "@/features/account/components/printableSeedDocument";
import { selectCurrentStep } from "../../../state";
import { KycWizard } from "../validation/types";
import { Steps, StepsCount } from "../../../types/steps";
import { kycActions } from "../../../state";

import differenceInYears from "date-fns/differenceInYears";

interface Props {
  children: ReactNode;
}

export const WizardLayout = ({ children }: Props) => {
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
  const cpf = watch("cpf");
  const birthDate = watch("birthDate");
  const birthPlace = watch("birthPlace");
  const phone = watch("phone");
  const profession = watch("profession");
  const streetAddress = watch("streetAddress");
  const complementaryStreetAddress = watch("complementaryStreetAddress");
  const zipCode = watch("zipCode");
  const city = watch("city");
  const state = watch("state");
  const country = watch("country");
  const proofOfAddress = watch("proofOfAddress");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const documentType = watch("documentType");
  const frontSide = watch("frontSide");
  const backSide = watch("backSide");
  const accountId = watch("accountId");
  const accountSeedPhrase = watch("accountSeedPhrase");

  const accountRS = accountId
    ? Address.fromNumericId(
        accountId,
        Ledger.AddressPrefix
      ).getReedSolomonAddress()
    : "";

  let cpfFieldError = !!errors.cpf?.message;
  let birthDateFieldError = !!errors.birthDate?.message;
  let birthPlaceFieldError = !!errors.birthPlace?.message;
  let phoneFieldError = !!errors.phone?.message;
  let professionFieldError = !!errors.profession?.message;
  let streetAddressFieldError = !!errors.streetAddress?.message;
  let complementaryStreetAddressFieldError =
    !!errors.complementaryStreetAddress?.message;
  let zipCodeFieldError = !!errors.zipCode?.message;
  let cityFieldError = !!errors.city?.message;
  let stateFieldError = !!errors.state?.message;
  let countryFieldError = !!errors.country?.message;
  let proofOfAddressFieldError = !!errors.proofOfAddress?.message;
  let firstNameFieldError = !!errors.firstName?.message;
  let lastNameFieldError = !!errors.lastName?.message;

  let canMoveToNextStep = false;

  switch (currentStep) {
    case Steps.AgreeTerms:
      canMoveToNextStep = agreeTerms;
      break;

    case Steps.BasicData:
      canMoveToNextStep = !!(
        cpf &&
        birthDate &&
        birthPlace &&
        !cpfFieldError &&
        !birthDateFieldError &&
        !birthPlaceFieldError
      );

      // Custom Birth Date Validation
      if (canMoveToNextStep) {
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
        complementaryStreetAddress &&
        zipCode &&
        city &&
        state &&
        country &&
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
        firstName &&
        lastName &&
        !firstNameFieldError &&
        !lastNameFieldError
      );
      break;

    case Steps.DocumentFiles:
      if (documentType === "cnh")
        canMoveToNextStep = !!(documentType && frontSide);

      if (documentType === "rne")
        canMoveToNextStep = !!(documentType && frontSide && backSide);
      break;

    case Steps.BlockchainAccountSetup:
      canMoveToNextStep = !!(accountId && accountSeedPhrase);
      break;

    case Steps.BlockchainAccountSeed:
      canMoveToNextStep = true;
      break;

    default:
      break;
  }

  const onClickBackButton = useCallback(() => {
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

      default:
        break;
    }
  }, [currentStep, router, stepMovement]);

  const onClickNextButton = useCallback(() => {
    switch (currentStep) {
      case Steps.AgreeTerms:
        dispatch(setAgreeTerms(agreeTerms));
        stepMovement(Steps.BasicData);
        break;

      case Steps.BasicData:
        dispatch(setSecondStep({ cpf, birthDate, birthPlace }));
        stepMovement(Steps.ComplementaryData);
        break;

      case Steps.ComplementaryData:
        dispatch(setThirdStep({ phone, profession }));
        stepMovement(Steps.ResidencyData);
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
        stepMovement(Steps.MotherData);
        break;

      case Steps.MotherData:
        dispatch(setMotherDataStep({ firstName, lastName }));
        stepMovement(Steps.DocumentFiles);
        break;

      case Steps.DocumentFiles:
        dispatch(setDocumentStep({ documentType, frontSide, backSide }));
        stepMovement(Steps.BlockchainAccountSetup);
        break;

      case Steps.BlockchainAccountSetup:
        stepMovement(Steps.BlockchainAccountSeed);
        break;

      case Steps.BlockchainAccountSeed:
        stepMovement(Steps.BlockchainAccountSeedVerification);
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
    cpf,
    birthDate,
    birthPlace,
    phone,
    profession,
    streetAddress,
    complementaryStreetAddress,
    zipCode,
    city,
    state,
    country,
    proofOfAddress,
    firstName,
    lastName,
    documentType,
    frontSide,
    backSide,
  ]);

  const bottomNav: BottomNavigationItem[] = [
    {
      label: t("back"),
      icon: <RiArrowLeftCircleLine />,
      onClick: onClickBackButton,
      type: "button",
    },
    {
      onClick: voidFn,
      label: "",
      type: "button",
      icon: <div />,
    },
    {
      label: t("next"),
      icon: <RiArrowRightCircleLine />,
      onClick: onClickNextButton,
      type:
        currentStep === Steps.BlockchainAccountSeedVerification
          ? "submit"
          : "button",
      color: "secondary",
      disabled: !canMoveToNextStep,
    },
  ];

  return (
    <>
      <PrintableSeedDocument seed={accountSeedPhrase} address={accountRS} />

      <Layout bottomNav={bottomNav}>
        <div className="print:hidden mt-4">
          <Stepper currentStep={currentStep} steps={StepsCount}></Stepper>
          {children}
        </div>
      </Layout>
    </>
  );
};
