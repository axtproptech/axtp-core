import { useRouter } from "next/router";
import { isEqual } from "lodash";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-daisyui";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiProfileFill,
} from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import {
  initialState,
  kycActions,
  selectCurrentStep,
  selectAgreeTerms,
  selectInitialSetupStep,
  selectSecondStep,
  selectThirdStep,
  selectFourthStep,
  selectMotherDataStep,
  selectDocumentStep,
  KycState,
} from "../../../../../state";
import { KycWizard } from "../../../validation/types";
import { Steps } from "../../../../../types/steps";

export const FormProgressTracker = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext<KycWizard>();
  const { reset } = kycActions;
  const router = useRouter();

  const stepMovement = async (newStep: Steps) => {
    await router.push(`#step${newStep}`, `#step${newStep}`, {
      shallow: true,
    });
  };

  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const agreeTerms = useAppSelector(selectAgreeTerms);
  const currentInitialSetupStep = useAppSelector(selectInitialSetupStep);
  const currentSecondStep = useAppSelector(selectSecondStep);
  const currentThirdStep = useAppSelector(selectThirdStep);
  const currentFourthStep = useAppSelector(selectFourthStep);
  const currentMotherDataStep = useAppSelector(selectMotherDataStep);
  const currentDocumentStep = useAppSelector(selectDocumentStep);

  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);
  const openDialog = () => setIsOpen(true);

  const searchForProgress = () => {
    // Made a copy because we do not want to mutate the redux state
    const copyDraft: KycState = {
      step: currentStep,
      agreeTerms,
      initialSetupStep: currentInitialSetupStep,
      secondStep: currentSecondStep,
      thirdStep: currentThirdStep,
      fourthStep: currentFourthStep,
      motherDataStep: currentMotherDataStep,
      documentStep: currentDocumentStep,
    };

    return !isEqual(initialState, copyDraft) ? openDialog() : null;
  };

  useEffect(() => {
    searchForProgress();
  }, []);

  const resetProgress = () => {
    dispatch(reset());
    closeDialog();
    stepMovement(Steps.AgreeTerms);
  };

  // Migrate persisted data from redux to react hook form
  const continueWithCurrentProgress = () => {
    const { cpf, birthDate, birthPlace } = currentSecondStep;

    const { phone, profession } = currentThirdStep;

    const {
      streetAddress,
      complementaryStreetAddress,
      zipCode,
      city,
      state,
      country,
      proofOfAddress,
    } = currentFourthStep;

    const { firstName, lastName } = currentMotherDataStep;

    const { documentType, frontSide, backSide } = currentDocumentStep;

    setValue("agreeTerms", agreeTerms);

    setValue("cpf", cpf);
    setValue("birthDate", birthDate);
    setValue("birthPlace", birthPlace);

    setValue("phone", phone);
    setValue("profession", profession);

    setValue("streetAddress", streetAddress);
    setValue("complementaryStreetAddress", complementaryStreetAddress);
    setValue("zipCode", zipCode);
    setValue("city", city);
    setValue("state", state);
    setValue("country", country);
    setValue("proofOfAddress", proofOfAddress);

    setValue("firstName", firstName);
    setValue("lastName", lastName);

    setValue("documentType", documentType);
    setValue("frontSide", frontSide);
    setValue("backSide", backSide);

    closeDialog();

    let stepToMove = currentStep;

    if (currentStep >= Steps.BlockchainAccountSeedVerification)
      stepToMove = Steps.BlockchainAccountSetup;

    stepMovement(currentStep);
  };

  return (
    <Modal open={isOpen} className="card glass">
      <Modal.Body>
        <h2 className="text-center text-white text-xl font-bold">
          {t("pick_where_you_left_off")}
        </h2>

        <h6 className="text-center font-medium">
          {t("pick_where_you_left_off_paragraph")}
        </h6>
      </Modal.Body>

      <Modal.Actions className="flex flex-col items-center justify-center ">
        <Button
          type="button"
          onClick={continueWithCurrentProgress}
          className="mb-2 text-sm capitalize"
          color="secondary"
        >
          {t("pick_where_you_left_off_accept_btn_label")}
        </Button>

        <Button
          type="button"
          onClick={resetProgress}
          className="text-sm capitalize"
        >
          {t("pick_where_you_left_off_reject_btn_label")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
