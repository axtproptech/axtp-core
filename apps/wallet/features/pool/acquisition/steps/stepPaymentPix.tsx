import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { Number } from "@/app/components/number";
import { HintBox } from "@/app/components/hintBox";
import QRCode from "react-qr-code";
import { CopyButton } from "@/app/components/buttons/copyButton";
import { AnimatedIconQrCode } from "@/app/components/animatedIcons/animatedIconQrCode";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";
import { NewChargeResponse } from "@/bff/types/newChargeResponse";
import { useAccount } from "@/app/hooks/useAccount";
import useSWR from "swr";

interface Props {
  onStatusChange: (status: "pending" | "paid") => void;
  quantity: number;
  poolId: string;
}

const DummyPayload =
  "00020126830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/210387E0-A6BF-45D1-80B5-CFEB9BBCEE2F5204899953039865802BR5921Pagseguro Internet SA6009SAO PAULO62070503***63047E6D";

export const StepPaymentPix: FC<Props> = ({
  onStatusChange,
  quantity,
  poolId,
}) => {
  const { t } = useTranslation();
  const { PaymentService } = useAppContext();
  const { accountId, customer } = useAccount();
  const { totalBRL } = usePaymentCalculator(quantity, poolId);
  const [isFetching, setIsFetching] = useState(false);
  const { showError, showSuccess } = useNotification();
  const [paymentCharge, setPaymentCharge] = useState<NewChargeResponse | null>(
    null
  );

  const { data: paymentStatus } = useSWR(
    paymentCharge ? `/payment/${paymentCharge.txId}` : null,
    async () => {
      if (!paymentCharge?.txId) return null;
      try {
        return await PaymentService.getPaymentStatus(paymentCharge.txId);
      } catch (e: any) {
        console.warn(
          `Could not get payment status for transaction ${paymentCharge.txId}`
        );
        throw e;
      }
    },
    {
      refreshInterval: 5_000,
    }
  );

  useEffect(() => {
    if (!customer) return;
    if (isFetching) return;

    setIsFetching(true);
    PaymentService.createPaymentUrl({
      amountBrl: totalBRL,
      quantity,
      accountId,
      customerId: customer.customerId,
      poolId,
    })
      .then((response) => {
        setPaymentCharge(response);
      })
      .catch((e) => {
        console.error("Problems while payment", e.message);
        showError(t("pix_error_creating_charge"));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [quantity, poolId, customer, totalBRL, accountId]);

  useEffect(() => {
    if (paymentStatus && paymentStatus.status === "paid") {
      showSuccess(t("pix_success"));
    }
  }, [paymentStatus, showSuccess, t]);

  // TODO: Success when payment is done successfully

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox className="my-0">
          <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
            <AnimatedIconQrCode loopDelay={5000} touchable />
          </div>
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
        <div className="bg-white rounded p-2 max-w-[200px] lg:max-w-[240px] mx-auto">
          <img
            className="m-0 pb-1 h-[28px] mx-auto"
            src="/assets/img/pix-logo.svg"
          />
          <div className={`${isFetching ? "blur-sm animate-pulse" : ""}`}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={paymentCharge ? paymentCharge.txId : DummyPayload}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
        <CopyButton
          textToCopy={paymentCharge ? paymentCharge.txId : ""}
          disabled={!paymentCharge}
        />
      </section>
      <section></section>
    </div>
  );
};
