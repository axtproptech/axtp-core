import { useTranslation } from "next-i18next";
import { FC, useState } from "react";
import { AttentionSeeker } from "react-awesome-reveal";
import { RiCheckboxCircleLine, RiFingerprintLine } from "react-icons/ri";
import { HintBox } from "@/app/components/hintBox";
import { PinInput } from "@/app/components/pinInput";
import { useAccount } from "@/app/hooks/useAccount";
import { Button } from "react-daisyui";
import { useNotification } from "@/app/hooks/useNotification";

interface Props {
  onConfirmed: () => void;
}

export const StepConfirm: FC<Props> = ({ onConfirmed }) => {
  const { t } = useTranslation();
  const [verified, setVerified] = useState(false);
  const [pin, setPin] = useState("");
  const { getKeys } = useAccount();
  const { showError } = useNotification();

  const handleConfirm = async () => {
    try {
      await getKeys(pin);
      setVerified(true);
      onConfirmed();
    } catch (e) {
      showError(t("wrong_pin"));
      setVerified(false);
    }
  };

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
            <p>{t("kyc_link_account_confirmation_hint")}</p>
          )}
        </HintBox>
      </section>
      <section className="flex flex-col justify-center">
        <div className="mx-auto">
          <PinInput onPinChange={setPin} />
          <Button
            color={"accent"}
            startIcon={<RiFingerprintLine />}
            disabled={pin.length < 5 || verified}
            className="mt-4"
            onClick={handleConfirm}
          >
            {t("confirm")}
          </Button>
        </div>
      </section>

      <section />
    </div>
  );
};
