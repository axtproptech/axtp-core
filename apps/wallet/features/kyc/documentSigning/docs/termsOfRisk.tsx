import { useAppContext } from "@/app/hooks/useAppContext";
import { forwardRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const TermsOfRisk = forwardRef<HTMLDivElement>(function TermsOfRisk(
  _,
  ref
) {
  const { Documents } = useAppContext();
  const [documentText, setDocumentText] = useState("");
  useEffect(() => {
    fetch(Documents.Privacy)
      .then((response) => response.text())
      .then(setDocumentText);
  }, [Documents.Privacy]);
  return (
    <article className="prose text-justify mx-auto">
      <ReactMarkdown>{documentText}</ReactMarkdown>
      <div ref={ref} className="h-1" />
    </article>
  );
});
