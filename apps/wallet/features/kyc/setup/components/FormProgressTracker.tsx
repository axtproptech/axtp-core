import { useRouter } from "next/router";
import { isEqual } from "lodash";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-daisyui";
import { useFormContext } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { AnimatedIconWarn } from "@/app/components/animatedIcons/animatedIconWarn";
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
} from "../../state";
import { KycWizard } from "../wizard/validation/types";
import { Steps } from "../../types/steps";

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
    if (router.pathname === "/kyc/setup" && currentInitialSetupStep.code) {
      return router.replace("/kyc/setup/wizard");
    }

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

    return currentStep > Steps.AgreeTerms && !isEqual(initialState, copyDraft)
      ? openDialog()
      : null;
  };

  useEffect(() => {
    searchForProgress();
  }, []);

  const resetProcess = () => {
    dispatch(reset());
    closeDialog();

    if (router.pathname === "/kyc/setup/wizard") router.replace("/kyc/setup");
  };

  // Migrate persisted data from redux to react hook form
  const continueWizard = () => {
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

    const { firstNameMother, lastNameMother } = currentMotherDataStep;

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

    setValue("firstNameMother", firstNameMother);
    setValue("lastNameMother", lastNameMother);

    setValue("documentType", documentType);
    setValue("frontSide", frontSide);
    setValue("backSide", backSide);

    let stepToMove = currentStep;

    if (currentStep >= Steps.BlockchainAccountSetup) {
      stepToMove = Steps.BlockchainAccountSetup;
    }

    stepMovement(stepToMove);

    closeDialog();
  };

  return (
    <Modal open={isOpen} className="card glass">
      <Modal.Body>
        <div className="h-20 w-20 mx-auto">
          <AnimatedIconWarn loopDelay={2500} />
        </div>

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
          onClick={continueWizard}
          className="mb-2 text-sm capitalize"
          color="secondary"
        >
          {t("pick_where_you_left_off_accept_btn_label")}
        </Button>

        <Button
          type="button"
          onClick={resetProcess}
          className="text-sm capitalize"
        >
          {t("pick_where_you_left_off_reject_btn_label")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
