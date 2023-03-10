import { useTranslation } from "next-i18next";
import { FC } from "react";
import { HintBox } from "@/app/components/hintBox";
import { PinInput } from "@/app/components/pinInput";

interface Props {
  onPinChange: (e: string) => void;
}

export const StepDefinePin: FC<Props> = ({ onPinChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("define_pin")}</h2>
      </section>
      <section>
        <div className="flex justify-center">
          <PinInput onPinChange={onPinChange} />
        </div>
      </section>
      <section className="mb-2">
        <HintBox text={t("define_pin_hint")} />
      </section>
    </div>
  );
};
