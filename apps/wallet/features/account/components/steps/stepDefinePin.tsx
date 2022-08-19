import { useTranslation } from "next-i18next";
import { Input } from "react-daisyui";
import { ChangeEvent, FC, useState } from "react";

interface Props {
  onPinChange: (e: string) => void;
}

const MinPinLength = 4;

export const StepDefinePin: FC<Props> = ({ onPinChange }) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value;
    setPin(p);
    onPinChange(p);
  };

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full">
      <section>
        <h2>{t("define_pin")}</h2>
      </section>
      <section className="mb-2">
        <div className="relative flex flex-col w-[75%] mx-auto">
          <Input
            className="text-center border-base-content"
            type={"password"}
            size="lg"
            minLength={MinPinLength}
            onChange={handlePinChange}
            placeholder={t("pin_input_placeholder")}
          />
          <small className="absolute right-[4px]">
            {pin.length}/{MinPinLength}+
          </small>
        </div>
      </section>
      <section className="w-[75%] mx-auto text-justify border border-base-content/50 p-4 rounded relative">
        <p>{t("define_pin_hint")}</p>
      </section>
    </div>
  );
};
