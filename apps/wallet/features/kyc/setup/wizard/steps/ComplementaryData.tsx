import { useTranslation } from "next-i18next";
import { FieldBox } from "@/app/components/fieldBox";
import { KycFormData } from "./kycFormData";
import { Checkbox, Form } from "react-daisyui";
import { StepLayout } from "../../components/StepLayout";
import { KycFormDataStepProps } from "./kycFormDataStepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { useEffect } from "react";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import * as React from "react";

export const ComplementaryData = ({
  validation,
  nextStep,
  previousStep,
  updateFormData,
  formData,
}: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();

  const canProceed = Boolean(
    formData.phone && formData.profession && !validation.hasError
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
        <h3>{t("sign_up_for_axt")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <div className="shadow bg-base-200 w-xl rounded-lg p-4 w-full mb-4">
          <Form.Label
            title={t("politically_exposed_person")}
            className="text-left font-bold"
          >
            <Checkbox
              onChange={(e) => updateFormData("pep", e.target.checked)}
              checked={formData.pep}
              size="lg"
              className="ml-2"
            />
          </Form.Label>
        </div>

        <FieldBox
          label={t("phone_number")}
          placeholder={t("phone_number_placeholder")}
          onChange={handleValueChange("phone")}
          helperText="E.g. +5511912341234"
          errorLabel={validation.errors?.phone}
        />

        <FieldBox
          label={t("profession")}
          placeholder={t("profession_placeholder")}
          onChange={handleValueChange("profession")}
          errorLabel={validation.errors?.profession}
        />
      </section>

      <section />
    </StepLayout>
  );
};
