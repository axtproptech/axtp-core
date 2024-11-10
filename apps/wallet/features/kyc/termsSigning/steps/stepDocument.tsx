import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import ReactMarkdown from "react-markdown";
import { SignableDocument } from "@/features/kyc/types/signableDocument";
import { SignedDocumentType } from "@/types/signedDocumentType";
import { useRouter } from "next/router";
import { useNotification } from "@/app/hooks/useNotification";
import { hashSHA256 } from "@signumjs/crypto";
import { doc } from "prettier";
import { LoadingBox } from "@/app/components/hintBoxes/loadingBox";
import { useTranslation } from "next-i18next";

interface Props {
  documentType: SignedDocumentType;
  onDocumentLoad: (document: SignableDocument) => void;
}

export const StepDocument = ({ documentType, onDocumentLoad }: Props) => {
  const ref = useRef(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { showError } = useNotification();
  const { Documents } = useAppContext();
  const [text, setText] = useState("");

  useEffect(() => {
    const url = Documents[documentType];
    if (!url) {
      showError("Unknown document type");
      router.replace("/");
      return;
    }

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const documentHash = hashSHA256(text);
        onDocumentLoad({
          documentHash,
          type: documentType,
          url,
        });
        setText(text);
      });
  }, []);

  return (
    <section className="relative flex flex-col justify-center gap-2 mt-4">
      {!text ? (
        <LoadingBox
          title={t("loading_document")}
          text={t("loading_document_text")}
        />
      ) : (
        <article className="prose text-justify mx-auto !h-[80vh] overflow-y-auto">
          <small className="text-center">{t("kyc-sign-scroll-down")}</small>
          <ReactMarkdown>{text}</ReactMarkdown>
          <div ref={ref} className="h-1" />
        </article>
      )}
    </section>
  );
};
