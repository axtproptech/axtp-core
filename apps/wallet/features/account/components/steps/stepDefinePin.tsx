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
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
      <section>
        <h2>{t("define_pin")}</h2>
      </section>
      <section className="relative top-[15%]">
        <div className="relative flex flex-col w-[50%] m-auto">
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
      <section className="w-[75%] m-auto text-justify border border-base-content/50 p-4 rounded relative top-8">
        <p>{t("define_pin_hint")}</p>
      </section>
    </div>
  );
};
