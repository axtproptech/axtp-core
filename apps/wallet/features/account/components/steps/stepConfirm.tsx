import { useTranslation } from "next-i18next";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Checkbox, Input } from "react-daisyui";
import { AttentionSeeker } from "react-awesome-reveal";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { HintBox } from "@/app/components/hintBox";
import { PinInput } from "@/app/components/pinInput";

interface Props {
  pin: string;
  onConfirmationChange: (verified: boolean) => void;
}

export const StepConfirm: FC<Props> = ({ pin, onConfirmationChange }) => {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const [confirmedPin, setConfirmedPin] = useState("");
  const [verified, setVerified] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAccepted(e.target.checked);
  };

  useEffect(() => {
    setVerified(confirmedPin === pin && accepted);
  }, [confirmedPin, pin, accepted]);

  useEffect(() => {
    onConfirmationChange(verified);
  }, [onConfirmationChange, verified]);

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("confirmation")}</h2>
      </section>
      <section>
        <HintBox>
          {verified ? (
            <AttentionSeeker effect="tada" className="text-center">
              <RiCheckboxCircleLine size={92} className="w-full" />
            </AttentionSeeker>
          ) : (
            <div className="flex flex-row">
              <Checkbox
                className="mr-2"
                color={"primary"}
                checked={accepted}
                onChange={handleChange}
              />
              <div>{t("confirmation_text")}</div>
            </div>
          )}
        </HintBox>
      </section>
      <section className="mt-2">
        <div className="flex justify-center">
          <PinInput onPinChange={setConfirmedPin} />
        </div>
      </section>
      <section />
    </div>
  );
};
