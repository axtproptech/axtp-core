import { useTranslation } from "next-i18next";
import { Input } from "react-daisyui";
import { cpf as CpfValidator } from "cpf-cnpj-validator";
import { PatternFormat } from "react-number-format";

import differenceInYears from "date-fns/differenceInYears";
import { StepLayout } from "../../components/StepLayout";
import { ChangeEvent, useEffect } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { KycFormDataStepProps } from "@/features/kyc/setup/wizard/steps/kycFormDataStepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import * as React from "react";
import { FieldBox } from "@/app/components/fieldBox";

export const BasicData = ({
  updateFormData,
  formData,
  validation,
  nextStep,
}: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const { KycService } = useAppContext();
  const { setNavItems } = useBottomNavigation();

  const canProceed = Boolean(
    formData.cpf &&
      formData.birthDate &&
      formData.birthPlace &&
      !validation.hasError
  );

  useEffect(() => {
    setNavItems([
      {
        route: "/",
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

  const handleCpf = (cpf: string) => {
    updateFormData("cpf", cpf);
    validation.clearError("cpf");
    if (CpfValidator.isValid(cpf)) {
      KycService.fetchCustomerDataByCpf(cpf)
        .then((c) => {
          validation.setError("cpf", "customer_already_exists");
        })
        .catch(() => {});
    } else {
      validation.setError("cpf", "invalid_cpf");
    }
  };

  const handleBirthdate = (e: ChangeEvent<HTMLInputElement>) => {
    const birthDate = e.target.value;
    updateFormData("birthDate", birthDate);
    validation.clearError("birthDate");
    if (birthDate) {
      const currentDate = new Date();
      const formattedBirthDate = new Date(birthDate);
      if (differenceInYears(currentDate, formattedBirthDate) < 18) {
        validation.setError("birthDate", "you_must_be_an_adult");
      }
    } else {
      validation.setError("birthDate", "required");
    }
  };

  const handleBirthplace = (e: ChangeEvent<HTMLInputElement>) => {
    const birthPlace = e.target.value;
    updateFormData("birthPlace", birthPlace);
    if (birthPlace) {
      validation.clearError("birthPlace");
    } else {
      validation.setError("birthPlace", "required");
    }
  };

  return (
    <StepLayout>
      <section>
        <h3>{t("sign_up_for_axt")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-base">{t("cpf")}</span>
          </label>
          <PatternFormat
            format="###.###.###-##"
            customInput={Input}
            allowEmptyFormatting
            onChange={undefined}
            onValueChange={(values) => handleCpf(values.value)}
            mask="_"
            size="lg"
            className="font-semibold"
            value={formData.cpf}
          />

          <label className="label">
            {validation.errors?.cpf ? (
              <span className="label-text-alt font-bold text-red-700">
                {t(validation.errors.cpf)}
              </span>
            ) : (
              <span className="label-text-alt opacity-70">
                {t("enter_cpf_field_hint")}
              </span>
            )}
          </label>
        </div>

        <FieldBox
          type="date"
          label={t("birth_date")}
          onChange={handleBirthdate}
          value={formData.birthDate}
          errorLabel={
            validation.errors?.birthDate ? t(validation.errors.birthDate) : ""
          }
        />

        <FieldBox
          label={t("birth_place")}
          onChange={handleBirthplace}
          value={formData.birthPlace}
          errorLabel={
            validation.errors?.birthPlace ? t(validation.errors.birthPlace) : ""
          }
        />
      </section>

      <section />
    </StepLayout>
  );
};
