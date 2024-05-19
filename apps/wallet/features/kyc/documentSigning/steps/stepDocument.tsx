import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import ReactMarkdown from "react-markdown";

interface Props {
  onReading: (hasRead: boolean) => void;
}

export const StepDocument = ({ onReading }: Props) => {
  const ref = useRef(null);
  const { Documents } = useAppContext();
  const [documentText, setDocumentText] = useState("");
  useEffect(() => {
    fetch(Documents.Privacy)
      .then((response) => response.text())
      .then(setDocumentText);
  }, [Documents.Privacy]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      onReading(entry.isIntersecting);
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

  return (
    <section className="relative flex flex-col justify-center gap-2 mt-4">
      <article className="prose text-justify mx-auto !h-[80vh] overflow-y-auto">
        <ReactMarkdown>{documentText}</ReactMarkdown>
        <div ref={ref} className="h-1" />
      </article>
    </section>
  );
};
