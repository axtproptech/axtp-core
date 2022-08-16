import { useTranslation } from "next-i18next";
import { ChangeEvent, FC } from "react";
import { Checkbox, Form, Input } from "react-daisyui";

interface Props {
  seed: string;
  pin: string;
}

export const StepFive: FC<Props> = ({ seed, pin }) => {
  const { t } = useTranslation();

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("PIN", e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Checked", e.target.checked);
  };

  return (
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
      <section>
        <h2>{t("confirmation")}</h2>
      </section>
      <section className="relative top-[15%]">
        <Input
          className="text-center border-base-content"
          type={"password"}
          size="lg"
          maxLength={7}
          onChange={handlePinChange}
          placeholder={t("pin_input_placeholder")}
        />
      </section>
      <section className="w-[75%] m-auto text-justify border border-base-content/50 px-4 py-2 rounded relative top-8">
        <div className="form-control w-full flex flex-row justify-center items-center py-2">
          <Checkbox
            className="mr-2"
            color={"primary"}
            onChange={handleChange}
          />
          <div>{t("confirmation_text")}</div>
        </div>
      </section>
    </div>
  );
};
