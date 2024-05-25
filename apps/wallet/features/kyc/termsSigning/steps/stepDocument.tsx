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

interface Props {
  onRead: (document: SignableDocument) => void;
  documentType: SignedDocumentType;
}

export const StepDocument = ({ onRead, documentType }: Props) => {
  const ref = useRef(null);
  const router = useRouter();
  const { showError } = useNotification();
  const { Documents } = useAppContext();
  const [readDocument, setReadDocument] = useState<SignableDocument | null>(
    null
  );
  const [text, setText] = useState("Loading...");

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
        setReadDocument({
          type: documentType,
          url,
          documentHash,
          hasRead: false,
        });
        setText(text);
      });
  }, [Documents, documentType, router, showError]);

  useEffect(() => {
    readDocument && onRead(readDocument);
  }, [onRead, readDocument]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setReadDocument((readDocument) =>
        readDocument
          ? { ...readDocument, hasRead: entry.isIntersecting }
          : readDocument
      );
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // TOOD: render when is still loading
  const isLoading = readDocument === null;

  return (
    <section className="relative flex flex-col justify-center gap-2 mt-4">
      {isLoading ? (
        <LoadingBox
          title={"Loading Terms..."}
          text={"Wait, while the document is being loaded..."}
        />
      ) : (
        <article className="prose text-justify mx-auto !h-[80vh] overflow-y-auto">
          <ReactMarkdown>{text}</ReactMarkdown>
          <div ref={ref} className="h-1" />
        </article>
      )}
    </section>
  );
};
