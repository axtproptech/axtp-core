import { useTranslation } from "next-i18next";
import { ChangeEvent, FC, useState } from "react";
import { Input } from "react-daisyui";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";
import { isAttachmentVersion } from "@signumjs/core";

interface Props {
  seed: string;
  onVerificationChange: (isValid: boolean) => void;
}

function selectRandomWord(seed: string) {
  const words = seed.split(" ");
  const index = Math.floor(Math.random() * words.length);
  return {
    word: words[index],
    index,
  };
}

export const StepVerifySeed: FC<Props> = ({ seed, onVerificationChange }) => {
  const { t } = useTranslation();
  const { index, word } = selectRandomWord(seed);
  const [verified, setVerified] = useState(false);

  const handleWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isVerified = word === e.target.value;
    setVerified(isVerified);
    onVerificationChange(isVerified);
  };

  return (
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
      <section>
        <h2>{t("verification")}</h2>
      </section>
      <section className="relative mt-[15%] mb-2">
        <Input
          className="text-center border-base-content"
          size="lg"
          onChange={handleWordChange}
          placeholder={t("verification_placeholder", { word: index + 1 })}
        />
      </section>
      <section className="w-[75%] m-auto  border border-base-content/50 px-4 py-2 rounded relative">
        {verified ? (
          <AttentionSeeker effect="tada" className="text-center">
            <RiCheckboxCircleLine size={92} className="w-full" />
          </AttentionSeeker>
        ) : (
          <p>{t("verification_hint", { word: index + 1 })}</p>
        )}
      </section>
    </div>
  );
};
