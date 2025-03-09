import { useTranslation } from "next-i18next";
import { Form, Checkbox, Alert } from "react-daisyui";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { FileUploader } from "@/app/components/fileUploader";
import { StepLayout } from "../../components/StepLayout";
import { KycFormDataStepProps } from "./kycFormDataStepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { useEffect } from "react";
import { voidFn } from "@/app/voidFn";
import * as React from "react";

export const DocumentFiles = ({
  updateFormData,
  formData,
  validation,
  previousStep,
  nextStep,
}: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();

  const canProceed = Boolean(
    formData.documentType && formData.frontSide && !validation.hasError
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

  const pickCnh = () => updateFormData("documentType", "cnh");
  const pickRne = () => updateFormData("documentType", "rne");
  const setDocumentFrontSideImageValue = (value: string) =>
    updateFormData("frontSide", value);
  const setDocumentBackSideImageValue = (value: string) =>
    updateFormData("backSide", value);

  return (
    <StepLayout>
      <section>
        <h3>{t("document")}</h3>
        <p className="text-justify">{t("document_upload_description")}</p>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <h3>{t("pick_document_type")}</h3>
        <div className="w-full flex flex-row items-center gap-2">
          <div
            className="shadow bg-base-200 w-1/2  rounded-lg p-4"
            onClick={pickCnh}
          >
            <Form.Label title={t("cnh")} className="font-bold">
              <Checkbox
                size="lg"
                checked={formData.documentType === "cnh"}
                color={formData.documentType === "cnh" ? "success" : undefined}
              />
            </Form.Label>
          </div>

          <div
            className="shadow bg-base-200 w-1/2  rounded-lg p-4"
            onClick={pickRne}
          >
            <Form.Label title={t("rg_or_RNE")} className="font-bold">
              <Checkbox
                size="lg"
                checked={formData.documentType === "rne"}
                color={formData.documentType === "rne" ? "success" : undefined}
              />
            </Form.Label>
          </div>
        </div>

        <h3>{t("send_files")}</h3>

        <section className="mb-2">
          <h3 className="my-0 mb-4 text-left">{t("front_side")}</h3>
          <div className="card glass w-full bg-base-100 shadow-xl">
            <div className="card-body flex-col justify-center items-center">
              {!!formData.frontSide && (
                <Alert
                  status="success"
                  className="text-sm text-center font-bold"
                >
                  <RiCheckboxCircleLine size={24} /> {t("file_upload_success")}
                </Alert>
              )}

              <FileUploader
                onUploadSuccess={setDocumentFrontSideImageValue}
                fileTypes={["image/*", "application/pdf"]}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="my-0 mb-4 text-left">{t("back_side")}</h3>
          <div className="card glass w-full bg-base-100 shadow-xl">
            <div className="card-body flex-col justify-center items-center">
              {!!formData.backSide && (
                <Alert
                  status="success"
                  className="text-sm text-center font-bold"
                >
                  <RiCheckboxCircleLine size={24} /> {t("file_upload_success")}
                </Alert>
              )}

              <FileUploader
                onUploadSuccess={setDocumentBackSideImageValue}
                fileTypes={["image/*", "application/pdf"]}
              />
            </div>
          </div>
        </section>
      </section>
    </StepLayout>
  );
};
