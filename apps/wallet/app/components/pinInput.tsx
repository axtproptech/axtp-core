import { Input } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useState } from "react";

interface Props {
  onPinChange: (pin: string) => void;
}

export const PinInput = ({ onPinChange }: Props) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");

  return (
    <div className="relative w-fit">
      <Input
        className="text-center border-base-content"
        type={"password"}
        size="lg"
        minLength={5}
        maxLength={9}
        onChange={(e) => {
          setPin(e.target.value);
          onPinChange(e.target.value);
        }}
        placeholder={t("pin_input_placeholder")}
        value={pin}
      />
      <small className="absolute right-2">{pin.length}</small>
    </div>
  );
};
