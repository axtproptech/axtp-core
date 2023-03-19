import { useAppContext } from "@/app/hooks/useAppContext";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const PrivacyPolicy = () => {
  const { Terms } = useAppContext();
  const [policyText, setPolicyText] = useState("");
  useEffect(() => {
    fetch(Terms.Privacy)
      .then((response) => response.text())
      .then(setPolicyText);
  }, []);
  return (
    <>
      <article className="prose text-justify mx-auto">
        <ReactMarkdown>{policyText}</ReactMarkdown>
      </article>
      <div className="h-[64px]"></div>
    </>
  );
};
