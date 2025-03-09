import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { LoadingBox } from "@/app/components/hintBoxes/loadingBox";
import { useTranslation } from "next-i18next";
import { StepProps } from "./stepProps";
import useSWR from "swr";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import { ErrorBox } from "@/app/components/hintBoxes/errorBox";
import { Fade } from "react-awesome-reveal";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { SignableDocumentType } from "@/types/signableDocumentType";

export const StepDocument = ({
  updateFormData,
  nextStep,
  previousStep,
}: StepProps) => {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const LedgerService = useLedgerService();
  const { setNavItems } = useBottomNavigation();

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        back: false,
        onClick: previousStep,
      },
      {
        route: "/",
        label: t("cancel"),
        icon: <RiCloseCircleLine />,
      },
      {
        label: t("next"),
        icon: <RiArrowRightCircleLine />,
        color: "secondary",
        onClick: nextStep,
      },
    ]);
  }, []);

  const { data, isLoading, error } = useSWR(
    query.type && LedgerService ? `fetchSigningDocument/${query.type}` : null,
    async () => {
      if (!LedgerService) {
        return null;
      }

      const { type, poolId } = query;

      const document = await LedgerService.termsSigner.fetchSignableDocument({
        type: type as SignableDocumentType,
        poolId: poolId as string,
        locale: locale ?? "en",
      });
      if (!document) {
        throw new Error("Loading document failed");
      }
      updateFormData("document", document);
      return document;
    }
  );

  return (
    <Fade className="opacity-0">
      <section className="relative flex flex-col justify-center gap-2 mt-4">
        {!isLoading && error && (
          <ErrorBox
            title={t("loading_document_failed")}
            text={t("loading_document_failed_text")}
          />
        )}
        {isLoading ? (
          <LoadingBox
            title={t("loading_document")}
            text={t("loading_document_text")}
          />
        ) : (
          <article className="prose text-justify mx-auto !h-[77vh] overflow-y-auto px-2 fancy-scrollbar">
            <ReactMarkdown>{data?.text ?? ""}</ReactMarkdown>
          </article>
        )}
      </section>
    </Fade>
  );
};
