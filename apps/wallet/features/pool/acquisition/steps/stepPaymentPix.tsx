import { useTranslation } from "next-i18next";
import { FC } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { Number } from "@/app/components/number";
import { HintBox } from "@/app/components/hintBox";
import QRCode from "react-qr-code";
import { useNotification } from "@/app/hooks/useNotification";
import { Button } from "react-daisyui";
import { RiClipboardLine } from "react-icons/ri";
import { CopyButton } from "@/app/components/buttons/copyButton";

interface Props {
  onStatusChange: (status: "pending" | "paid") => void;
  quantity: number;
  priceAXTC: number;
}

const TestPayload =
  "00020126830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/210387E0-A6BF-45D1-80B5-CFEB9BBCEE2F5204899953039865802BR5921Pagseguro Internet SA6009SAO PAULO62070503***63047E6D";

export const StepPaymentPix: FC<Props> = ({
  onStatusChange,
  quantity,
  priceAXTC,
}) => {
  const { t } = useTranslation();
  const { totalBRL } = usePaymentCalculator(quantity, priceAXTC);

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox className="my-0">
          <div className="text-center">
            <h3 className="my-1">
              {t("acquire_about_to_buy", { count: quantity })}
            </h3>
            <h3>
              <Number value={totalBRL} suffix="BRL" />
            </h3>
            <small>{t("pix_payments_only")}</small>
          </div>
        </HintBox>
      </section>
      <section className="w-[300px] mx-auto">
        <div className="bg-white rounded p-2 max-w-[200px] mx-auto">
          <img
            className="m-0 pb-1 h-[28px] mx-auto"
            src="/assets/img/pix-logo.svg"
          />
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={TestPayload}
            viewBox={`0 0 256 256`}
          />
        </div>
        <CopyButton text={TestPayload} />
      </section>
      <section></section>
    </div>
  );
};
