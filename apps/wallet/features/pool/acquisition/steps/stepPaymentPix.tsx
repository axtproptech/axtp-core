import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { HintBox } from "@/app/components/hintBox";
import QRCode from "react-qr-code";
import { CopyButton } from "@/app/components/buttons/copyButton";
import { AnimatedIconQrCode } from "@/app/components/animatedIcons/animatedIconQrCode";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";
import { NewPixPaymentResponse } from "@/bff/types/newPixPaymentResponse";
import { useAccount } from "@/app/hooks/useAccount";
import useSWR from "swr";
import { Button } from "react-daisyui";
import { RiCheckboxCircleLine, RiQrCodeFill } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";
import * as React from "react";
import { Countdown } from "@/app/components/countdown";
import { formatNumber } from "@/app/formatNumber";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { ChainValue } from "@signumjs/util";
import { TrackingEventService } from "@/app/services";

interface Props {
  onStatusChange: (status: "pending" | "confirmed") => void;
  quantity: number;
  poolId: string;
}

const DummyPayload =
  "00020101021226850014br.gov.bcb.pix2563api-h.pagseguro.com/pix/v2/B79D624F-EB26-4F88-B5C6-6B1B7D31EC6127600016BR.COM.PAGSEGURO0136B79D624F-EB26-4F88-B5C6-6B1B7D31EC6152048999530398654045.005802BR5922AXT PropTech Company S6007JUNDIAI62070503***6304DFB6";

export const StepPaymentPix: FC<Props> = ({
  onStatusChange,
  quantity,
  poolId,
}) => {
  const { t } = useTranslation();
  const { PaymentService, TrackingEventService } = useAppContext();
  const { accountId, customer, accountPublicKey } = useAccount();
  const { token } = useAppSelector(selectPoolContractState(poolId));
  const { totalBRL, totalAXTC } = usePaymentCalculator(quantity, poolId);
  const [isFetching, setIsFetching] = useState(false);
  const { showError, showSuccess } = useNotification();
  const [payment, setPayment] = useState<NewPixPaymentResponse | null>(null);

  const { data: paymentStatus } = useSWR(
    payment ? `/payment/${payment.txId}` : null,
    async () => {
      if (!payment?.txId) return null;
      try {
        return await PaymentService.getPixPaymentStatus(payment.txId);
      } catch (e: any) {
        console.warn(
          `Could not get payment status for transaction ${payment.txId}`
        );
        throw e;
      }
    },
    {
      refreshInterval: 5_000,
    }
  );

  const handleCreatePixPaymentUrl = async () => {
    if (!customer) return;
    if (isFetching) return;

    setIsFetching(true);
    PaymentService.createPixPaymentUrl({
      amountBrl: totalBRL,
      quantity: Number(
        ChainValue.create(token.decimals).setCompound(quantity).getCompound()
      ),
      accountId,
      customerId: customer.customerId,
      tokenName: token.name,
    })
      .then((response) => {
        setPayment(response);
      })
      .catch((e) => {
        console.error("Problems while payment", e.message);
        showError(new Error(t("pix_error_creating_charge")));
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (!customer) return;
    if (!payment) return;
    if (!(paymentStatus && paymentStatus.status === "confirmed")) {
      return;
    }

    PaymentService.createPaymentRecord({
      paymentType: "pix",
      currency: "BRL",
      usd: totalAXTC.toString(),
      txId: payment.txId,
      tokenId: token.id,
      tokenQnt: ChainValue.create(token.decimals)
        .setCompound(quantity)
        .getCompound(),
      amount: totalBRL.toString(),
      customerId: customer.customerId,
      poolId,
      accountPk: accountPublicKey,
    })
      .then(() => {
        showSuccess(t("pix_success"));
        onStatusChange("confirmed");
      })
      .catch((e) => {
        console.error("Problems while payment", e.message);
        showError(t("pix_error_create_record"));
      });
  }, [paymentStatus]); // listen only to paymentstatus

  useEffect(() => {
    setPayment(null);
  }, [totalBRL]);

  const handleTimeout = () => {
    if (!payment) return;
    TrackingEventService.track({
      msg: "PIX Payment Cancelled/Timed Out",
      detail: { reference: payment.txId },
    });
    setPayment(null);
  };

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
              {t("acquire_about_to_buy", {
                count: quantity,
                amount: formatNumber({ value: totalBRL, suffix: "BRL" }),
              })}
            </h3>
            <small>{t("pix_payments_description")}</small>
          </div>
        </HintBox>
      </section>
      {(!paymentStatus || paymentStatus.status !== "confirmed") && (
        <section className="w-[300px] mx-auto">
          {payment && (
            <div className="flex justify-center">
              <Countdown
                seconds={5 * 60}
                onTimeout={handleTimeout}
                className={"font-mono text-xl"}
              />
            </div>
          )}
          <div className="bg-white rounded p-2 max-w-[200px] lg:max-w-[240px] mx-auto relative">
            <img
              className="m-0 pb-1 h-[28px] mx-auto"
              src="/assets/img/pix-logo.svg"
              alt="Pix Logo"
            />
            <div className={`${!payment ? "blur-sm" : ""}`}>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={payment ? payment.pixUrl : DummyPayload}
                viewBox={`0 0 256 256`}
              />
            </div>
            {!payment && (
              <div className="absolute top-1/2 lg:left-[64px] left-[38px] drop-shadow-lg">
                <Button
                  color="primary"
                  onClick={handleCreatePixPaymentUrl}
                  loading={isFetching}
                >
                  <AttentionSeeker delay={4000} effect="heartBeat">
                    <RiQrCodeFill className="mr-2" />
                  </AttentionSeeker>
                  {t("pix_generate")}
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center items-center">
            <Button
              className="w-1/2"
              color="ghost"
              onClick={handleTimeout}
              disabled={!payment}
            >
              {t("cancel")}
            </Button>
            <CopyButton
              textToCopy={payment ? payment.txId : ""}
              disabled={!payment}
            />
          </div>
        </section>
      )}
      {paymentStatus && paymentStatus.status === "confirmed" && (
        <AttentionSeeker effect="tada" className="text-center">
          <RiCheckboxCircleLine size={92} className="w-full" />
        </AttentionSeeker>
      )}
      <section></section>
    </div>
  );
};
