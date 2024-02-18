import { Input } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { forwardRef, useMemo, useState } from "react";

interface Props {
  onPinChange: (pin: string) => void;
}

export const PinInput = forwardRef<HTMLInputElement, Props>(
  ({ onPinChange }, ref) => {
    const { t } = useTranslation();
    const [pin, setPin] = useState("");

    return (
      <div>
        <div className="relative w-fit mx-auto">
          <Input
            ref={ref}
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
      </div>
    );
  }
);

PinInput.displayName = "PinInput";
