import { useTranslation } from "next-i18next";
import { Alert, Input } from "react-daisyui";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { PatternFormat } from "react-number-format";
import { FieldBox } from "@/app/components/fieldBox";
import { FileUploader } from "@/app/components/fileUploader";
import { KycFormData } from "./kycFormData";
import { StepLayout } from "../../components/StepLayout";
import { ChangeEvent, useEffect } from "react";
import { KycFormDataStepProps } from "./kycFormDataStepProps";
import { voidFn } from "@/app/voidFn";
import * as React from "react";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";

export const ResidencyData = ({
  validation,
  formData,
  updateFormData,
  nextStep,
  previousStep,
}: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();

  const canProceed =
    Boolean(
      formData.city &&
        formData.streetAddress &&
        formData.zipCode &&
        formData.state &&
        formData.proofOfAddress
    ) && !validation.hasError;

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
    (fieldName: keyof KycFormData, isRequired?: boolean) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      updateFormData(fieldName, e.target.value);
      if (!v && isRequired) {
        validation.setError(fieldName, "required");
      }
    };

  const binding = (fieldName: keyof KycFormData, isRequired?: boolean) => ({
    onChange: handleValueChange(fieldName, isRequired),
    value: formData[fieldName] as string,
    errorLabel: validation.errors ? validation.errors[fieldName] : "",
  });

  return (
    <StepLayout>
      <section>
        <h3>{t("residency_address")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <FieldBox
          {...binding("streetAddress", true)}
          label={t("street_address")}
          placeholder={t("street_address_placeholder")}
        />

        <FieldBox
          {...binding("complementaryStreetAddress")}
          label={t("second_street_address")}
          placeholder={t("second_street_address_placeholder")}
        />

        <div className="flex flex-col lg:flex-row justify-between items-start w-full">
          <div className="w-full lg:w-1/2 pr-2">
            <label className="label">
              <span className="label-text font-bold text-base">
                {t("zip_code")}
              </span>
            </label>
            <PatternFormat
              format="#####-###"
              customInput={Input}
              allowEmptyFormatting
              placeholder={t("zip_code")}
              onChange={undefined}
              onValueChange={(values) => {
                updateFormData("zipCode", values.value);
              }}
              mask="_"
              size="lg"
              className="font-semibold w-full"
            />
            <label className="label">
              {validation.errors && validation.errors.zipCode && (
                <span className="label-text-alt font-bold text-red-700">
                  {t(validation.errors.zipCode)}
                </span>
              )}
            </label>
          </div>

          <div className="w-full">
            <FieldBox
              {...binding("city", true)}
              label={t("city")}
              placeholder={t("city")}
            />
          </div>
        </div>

        <FieldBox
          {...binding("state", true)}
          label={t("state")}
          placeholder={t("state")}
          className="mb-4"
        />

        <section>
          <h3 className="my-0 mb-4">{t("proof_of_address")}</h3>
          <div className="card glass w-full bg-base-100 shadow-xl">
            <div className="card-body flex-col justify-center items-center">
              {formData.proofOfAddress && (
                <Alert
                  status="success"
                  className="text-sm text-center font-bold"
                >
                  <RiCheckboxCircleLine size={24} /> {t("file_upload_success")}
                </Alert>
              )}

              <FileUploader
                onUploadSuccess={(fileName) =>
                  updateFormData("proofOfAddress", fileName)
                }
                fileTypes={["image/*", "application/pdf"]}
              />
            </div>
          </div>
        </section>
      </section>
    </StepLayout>
  );
};
