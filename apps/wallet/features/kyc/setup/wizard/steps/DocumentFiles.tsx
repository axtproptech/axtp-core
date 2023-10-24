import { useTranslation } from "next-i18next";
import { useFormContext } from "react-hook-form";
import { Form, Checkbox, Alert } from "react-daisyui";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FileUploader } from "@/app/components/fileUploader";
import { KycWizard } from "../validation/types";

export const DocumentFiles = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<KycWizard>();

  const documentType = watch("documentType");
  const frontSide = watch("frontSide");
  const backSide = watch("backSide");

  const pickCnh = () => setValue("documentType", "cnh");
  const pickRne = () => setValue("documentType", "rne");

  const setDocumentFrontSideImageValue = (value: string) =>
    setValue("frontSide", value);
  const setDocumentBackSideImageValue = (value: string) =>
    setValue("backSide", value);

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
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
                checked={documentType === "cnh"}
                color={documentType === "cnh" ? "success" : undefined}
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
                checked={documentType === "rne"}
                color={documentType === "rne" ? "success" : undefined}
              />
            </Form.Label>
          </div>
        </div>

        <h3>{t("send_files")}</h3>

        <section className="mb-2">
          <h3 className="my-0 mb-4 text-left">{t("front_side")}</h3>
          <div className="card glass w-full bg-base-100 shadow-xl">
            <div className="card-body flex-col justify-center items-center">
              {!!frontSide && (
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
              {!!backSide && (
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
    </div>
  );
};
