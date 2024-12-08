import { useTranslation } from "next-i18next";
import { FieldBox } from "@/app/components/fieldBox";
import { KycFormData } from "./kycFormData";
import { StepLayout } from "../../components/StepLayout";
import { useEffect } from "react";
import { KycFormDataStepProps } from "./kycFormDataStepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import * as React from "react";

export const MotherData = ({
  formData,
  updateFormData,
  nextStep,
  previousStep,
  validation,
}: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();

  const canProceed = Boolean(
    formData.firstNameMother && formData.lastNameMother && !validation.hasError
  );

  useEffect(() => {
    setNavItems([
      {
        onClick: previousStep,
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        type: "button",
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
        disabled: !canProceed,
        color: "secondary",
      },
    ]);
  }, [canProceed]);

  const handleValueChange =
    (field: keyof KycFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (!v) {
        validation.setError(field, "required");
      } else {
        validation.clearError(field);
      }
      updateFormData(field, v);
    };

  return (
    <StepLayout>
      <section>
        <h3>{t("mothers_full_name")}</h3>
        <p className="text-justify">{t("mothers_full_name_description")}</p>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <FieldBox
          value={formData.firstNameMother}
          onChange={handleValueChange("firstNameMother")}
          label={t("mothers_first_name")}
          placeholder={t("enter_first_name_placeholder")}
          errorLabel={
            validation.errors?.firstNameMother
              ? t(validation.errors.firstNameMother)
              : ""
          }
        />
        <FieldBox
          value={formData.lastNameMother}
          onChange={handleValueChange("lastNameMother")}
          label={t("mothers_last_name")}
          placeholder={t("enter_last_name_placeholder")}
          errorLabel={
            validation.errors?.lastNameMother
              ? t(validation.errors.lastNameMother)
              : ""
          }
        />
      </section>
    </StepLayout>
  );
};
