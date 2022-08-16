import { useTranslation } from "next-i18next";
import { Input } from "react-daisyui";
import { ChangeEvent, KeyboardEvent, useState } from "react";

export const StepOne = () => {
  const { t } = useTranslation();

  const [pinValue, setPinValue] = useState("");

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("PIN", e.target.value);
  };

  return (
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none">
      <section>
        <h2>{t("define_pin")}</h2>
      </section>
      <section className="relative top-[15%]">
        <Input
          className="text-center"
          type={"password"}
          size="lg"
          maxLength={7}
          onChange={handlePinChange}
          placeholder="ENTER YOUR SECRET"
        />
      </section>
      <section className="w-[75%] m-auto text-justify border border-base-content/50 p-4 rounded relative top-8">
        <small>{t("define_pin_hint")}</small>
      </section>
    </div>
  );
};
