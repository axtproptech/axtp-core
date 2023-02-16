import { useTranslation } from "next-i18next";
import { ChangeEvent, FC, useState } from "react";
import { Button, Textarea } from "react-daisyui";
import { HintBox } from "@/app/components/hintBox";
import { RiClipboardLine, RiDeleteBinLine, RiQrScanLine } from "react-icons/ri";
import { QrReader, OnResultFunction } from "react-qr-reader";
import { useNotification } from "@/app/hooks/useNotification";

interface Props {
  onSeedChange: (seed: string) => void;
}

export const StepImportSeed: FC<Props> = ({ onSeedChange }) => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false);
  const [value, setValue] = useState("");

  const handleSeedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onSeedChange(e.target.value);
  };

  const handleScan = () => {
    setValue("");
    setOpenQrCodeScanner(true);
  };

  const handleOnResult: OnResultFunction = (result, error) => {
    if (!!result) {
      setValue(result.getText());
      setOpenQrCodeScanner(false);
      onSeedChange(result.getText());
      return;
    }

    if (!!error) {
      setOpenQrCodeScanner(false);
      setValue("");
      showError(new Error(t("qrscan_failure")));
      console.error(error.message);
    }
  };

  const handleCancelScan = () => {
    setOpenQrCodeScanner(false);
    onSeedChange("");
  };

  const handleClear = () => {
    setValue("");
    onSeedChange("");
  };

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("enter_your_seed")}</h2>
      </section>
      {!openQrCodeScanner ? (
        <>
          <section className="relative mt-[15%] mb-2">
            <Textarea
              className="w-full lg:w-[75%] text-justify border-base-content text-lg"
              onChange={handleSeedChange}
              value={value}
              aria-label={t("enter_your_seed")}
              rows={3}
            />
            <div className="flex flex-row justify-evenly align-middle">
              <Button color="ghost" onClick={handleClear}>
                <RiDeleteBinLine className="mr-2" />
                {t("clear")}
              </Button>
              <Button color="secondary" onClick={handleScan}>
                <RiQrScanLine className="mr-2" />
                {t("scan")}
              </Button>
            </div>
          </section>
          <section>
            <HintBox text={t("enter_your_seed_hint")} />
          </section>
        </>
      ) : (
        <>
          <section>
            <QrReader
              constraints={{}}
              onResult={(args) => handleOnResult(args)}
            ></QrReader>
          </section>
          <section>
            <Button color="primary" onClick={handleCancelScan}>
              {t("cancel")}
            </Button>
          </section>
        </>
      )}
    </div>
  );
};
