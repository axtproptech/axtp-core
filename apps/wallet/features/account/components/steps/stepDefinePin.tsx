import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import { HintBox } from "@/app/components/hintBox";
import { PinInput } from "@/app/components/pinInput";

interface Props {
  onPinChange: (e: string) => void;
}

export const StepDefinePin: FC<Props> = ({ onPinChange }) => {
  const { t } = useTranslation();
  const [isWeak, setIsWeak] = useState(false);
  const handlePinChange = (pin: string) => {
    setIsWeak(pin.startsWith("12345"));
    onPinChange(pin);
  };

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("define_pin")}</h2>
      </section>
      <section>
        <div className="flex flex-col justify-center">
          <PinInput onPinChange={handlePinChange} />
          {isWeak && (
            <small className="text-error mt-2">{t("pin_weak_pin")}</small>
          )}
        </div>
      </section>
      <section className="mb-2">
        <HintBox text={t("define_pin_hint")} />
      </section>
      <section />
    </div>
  );
};
