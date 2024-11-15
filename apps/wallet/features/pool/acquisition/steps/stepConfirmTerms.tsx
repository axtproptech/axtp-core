import { useTranslation } from "next-i18next";
import { ChangeEvent, FC, useState } from "react";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import * as React from "react";
import { Checkbox } from "react-daisyui";
import useSWR from "swr";
import ReactMarkdown from "react-markdown";

interface Props {
  poolName: string;
  onConfirmChange: (confirmed: boolean) => void;
}

export const StepConfirmTerms: FC<Props> = ({ poolName, onConfirmChange }) => {
  const { t, i18n } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);

  const { data: terms, error } = useSWR(
    `getTerms/${poolName}`,
    async () => {
      const response = await fetch(
        `/assets/docs/${
          i18n.language
        }/acquisition-terms-${poolName.toLowerCase()}.md`
      );
      return response.text();
    },
    {}
  );

  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    const accepted = e.target.checked;
    setConfirmed(accepted);
    onConfirmChange(accepted);
  };

  return (
    <div className="flex flex-col justify-between text-center relative prose w-full mx-auto">
      <section className="px-4 mt-12">
        <HintBox>
          <div className="flex flex-row">
            <Checkbox
              className="mr-2"
              color={"primary"}
              checked={confirmed}
              onChange={handleConfirmChange}
            />
            <div>{t("confirmation_acquisition_text")}</div>
          </div>
        </HintBox>
      </section>
      <div className="relative">
        <div className="absolute z-10 top-0 bg-gradient-to-b from-base-100 h-10 w-full opacity-80" />
      </div>
      <section className="px-4 mt-2 overflow-x-auto text-justify fancy-scrollbar h-[calc(100vh-372px)]">
        {terms && <ReactMarkdown>{terms}</ReactMarkdown>}
      </section>
    </div>
  );
};
