import { useTranslation } from "next-i18next";
import { ChangeEvent, FC } from "react";
import { Textarea } from "react-daisyui";
import { HintBox } from "@/app/components/hintBox";

interface Props {
  onSeedChange: (seed: string) => void;
}

export const StepImportSeed: FC<Props> = ({ onSeedChange }) => {
  const { t } = useTranslation();

  const handleSeedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onSeedChange(e.target.value);
  };

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("enter_your_seed")}</h2>
      </section>
      <section className="relative mt-[15%] mb-2">
        <Textarea
          className="w-full lg:w-[75%] text-justify border-base-content text-lg"
          onChange={handleSeedChange}
          aria-label={t("enter_your_seed")}
          rows={3}
        />
      </section>
      <section>
        <HintBox text={t("enter_your_seed_hint")} />
      </section>
    </div>
  );
};
