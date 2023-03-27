import { useTranslation } from "next-i18next";
import { ChangeEvent, FC, useMemo, useState } from "react";
import { Button, Textarea } from "react-daisyui";
import { HintBox } from "@/app/components/hintBox";
import { RiClipboardLine, RiDeleteBinLine, RiQrScanLine } from "react-icons/ri";
import { QrReader, OnResultFunction } from "react-qr-reader";
import { useNotification } from "@/app/hooks/useNotification";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";

interface Props {
  onSeedChange: (seed: string) => void;
  publicKey: string;
}

export const StepImportSeed: FC<Props> = ({ onSeedChange, publicKey }) => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false);
  const [value, setValue] = useState("");
  const { Ledger } = useAppContext();

  const account = useMemo(
    () =>
      publicKey
        ? Address.fromPublicKey(
            publicKey,
            Ledger.AddressPrefix
          ).getReedSolomonAddress()
        : "",
    [publicKey, Ledger.AddressPrefix]
  );
  const handleSeedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const prunedSeed = e.target.value.replace(/[\t\n\r]/g, " ");
    setValue(prunedSeed);
    onSeedChange(prunedSeed);
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
          <section>
            <HintBox text={!account ? t("enter_your_seed_hint") : undefined}>
              {account && (
                <>
                  <div className="text-center text-lg font-bold">{account}</div>
                  <small>{t("verify_your_account_hint")}</small>
                </>
              )}
            </HintBox>
          </section>
          <section className="relative mt-[15%] mb-2">
            <Textarea
              className="w-full lg:w-[75%] text-justify border-base-content text-lg"
              onChange={handleSeedChange}
              value={value}
              aria-label={t("enter_your_seed")}
              rows={3}
            />
            <div className="flex flex-row justify-evenly align-middle">
              <Button
                color="ghost"
                onClick={handleClear}
                startIcon={<RiDeleteBinLine />}
              >
                {t("clear")}
              </Button>
              <Button
                color="secondary"
                onClick={handleScan}
                startIcon={<RiQrScanLine />}
              >
                {t("scan")}
              </Button>
            </div>
          </section>
          <section />
        </>
      ) : (
        <>
          <section>
            <QrReader
              constraints={{ facingMode: { ideal: "environment" } }}
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
