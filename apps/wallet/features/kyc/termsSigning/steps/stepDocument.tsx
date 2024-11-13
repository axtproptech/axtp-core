import { useEffect, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { hashSHA256 } from "@signumjs/crypto";
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

export const StepDocument = ({
  updateData,
  nextStep,
  previousStep,
}: StepProps) => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { Documents } = useAppContext();
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

  const {
    data: text,
    isLoading,
    error,
  } = useSWR(
    query.type ? `fetchSigningDocument/${query.type}` : null,
    async () => {
      const { type } = query;

      // @ts-ignore
      const url = Documents[type];
      if (!url) {
        console.error("error", query);
        throw new Error("Unknown document type");
      }

      const response = await fetch(url);
      const text = await response.text();
      const documentHash = hashSHA256(text);
      updateData("document", {
        documentHash,
        type,
        url,
      });
      return text;
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
          <article className="prose text-justify mx-auto !h-[80vh] overflow-y-auto">
            <small className="text-center">{t("kyc-sign-scroll-down")}</small>
            <ReactMarkdown>{text ?? ""}</ReactMarkdown>
          </article>
        )}
      </section>
    </Fade>
  );
};
