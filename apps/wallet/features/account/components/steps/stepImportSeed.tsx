import { useTranslation } from "next-i18next";
import { ChangeEvent, FC } from "react";
import { Textarea } from "react-daisyui";

interface Props {
  onSeedChange: (seed: string) => void;
}

export const StepImportSeed: FC<Props> = ({ onSeedChange }) => {
  const { t } = useTranslation();

  const handleSeedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onSeedChange(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
      <section>
        <h2>{t("enter_your_seed")}</h2>
      </section>
      <section className="relative top-[15%]">
        <Textarea
          className="text-justify border-base-content text-lg"
          onChange={handleSeedChange}
          aria-label={t("enter_your_seed")}
          rows={5}
        />
      </section>
      <section className="w-[75%] m-auto  border border-base-content/50 px-4 py-2 rounded relative top-8">
        <p>{t("enter_your_seed_hint")}</p>
      </section>
    </div>
  );
};
