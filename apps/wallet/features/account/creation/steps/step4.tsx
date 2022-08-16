import { useTranslation } from "next-i18next";
import { ChangeEvent, FC } from "react";
import { Input } from "react-daisyui";

interface Props {
  seed: string;
}

function selectRandomWord(seed: string) {
  const words = seed.split(" ");
  const index = Math.floor(Math.random() * words.length);
  return {
    word: words[index],
    index,
  };
}

export const StepFour: FC<Props> = ({ seed }) => {
  const { t } = useTranslation();
  const { index, word } = selectRandomWord(seed);

  const handleWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Word", e.target.value);
  };

  return (
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
      <section>
        <h2>{t("verification")}</h2>
      </section>
      <section className="relative top-[15%]">
        <Input
          className="text-center border-base-content"
          size="lg"
          onChange={handleWordChange}
          placeholder={t("verification_placeholder", { word: index + 1 })}
        />
      </section>
      <section className="w-[75%] m-auto text-justify border border-base-content/50 px-4 py-2 rounded relative top-8">
        <p>{t("verification_hint", { word: index + 1 })}</p>
      </section>
    </div>
  );
};
