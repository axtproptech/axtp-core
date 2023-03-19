import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { HintBox } from "@/app/components/hintBox";
import QRCode from "react-qr-code";
import { CopyButton } from "@/app/components/buttons/copyButton";
import { AnimatedIconQrCode } from "@/app/components/animatedIcons/animatedIconQrCode";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";
import { useAccount } from "@/app/hooks/useAccount";
import { Button } from "react-daisyui";
import { RiCheckboxCircleLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";
import * as React from "react";
import { formatNumber } from "@/app/formatNumber";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { ChainValue } from "@signumjs/util";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";

interface Props {
  onStatusChange: (status: "pending" | "confirmed") => void;
  quantity: number;
  poolId: string;
}

export const StepPaymentPix: FC<Props> = ({
  onStatusChange,
  quantity,
  poolId,
}) => {
  const { t } = useTranslation();
  const { PaymentService, Payment, TrackingEventService } = useAppContext();
  const { customer, accountPublicKey } = useAccount();
  const { token } = useAppSelector(selectPoolContractState(poolId));
  const { totalBRL, totalAXTC } = usePaymentCalculator(quantity, poolId);
  const [paymentDone, setPaymentDone] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { showError, showSuccess } = useNotification();

  const handleConfirmPayment = async () => {
    if (!customer) return;

    try {
      setIsConfirming(true);

      const payment = {
        paymentType: "pix",
        currency: "BRL",
        usd: totalAXTC.toString(),
        txId: "",
        tokenId: token.id,
        tokenQnt: ChainValue.create(token.decimals)
          .setCompound(quantity)
          .getCompound(),
        amount: totalBRL.toString(),
        customerId: customer.customerId,
        poolId,
        accountPk: accountPublicKey,
      } as RegisterPaymentRequest;

      TrackingEventService.track({
        msg: "Confirm Payment Button Clicked",
        detail: payment,
      });

      await PaymentService.createPaymentRecord(payment);
      showSuccess(t("pix_success"));
      onStatusChange("confirmed");
      setPaymentDone(true);
    } catch (e: any) {
      console.error("Problems while payment", e.message);
      showError(t("pix_error_create_record"));
    } finally {
      setIsConfirming(false);
    }
  };

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
                amount: formatNumber({
                  value: totalBRL,
                  suffix: "BRL",
                  decimals: 2,
                }),
              })}
            </h3>
            <small>{t("pix_payments_description")}</small>
          </div>
        </HintBox>
      </section>
      <section>
        {paymentDone ? (
          <HintBox className="my-0">
            <AttentionSeeker effect="tada" className="text-center">
              <RiCheckboxCircleLine size={92} className="w-full" />
            </AttentionSeeker>
            <div>{t("confirm_payment_success")}</div>
          </HintBox>
        ) : (
          <>
            <HintBox className="my-0">
              <div className="text-center">
                <img
                  className="m-0 pb-1 h-[28px] mx-auto"
                  src="/assets/img/pix-logo.svg"
                  alt="Pix Logo"
                />
                <div className="text-xl font-bold py-1">{Payment.PixKey}</div>
                <CopyButton textToCopy={Payment.PixKey} />
              </div>
            </HintBox>
            <div className="animate-wiggle mt-8">
              <Button
                color="primary"
                onClick={handleConfirmPayment}
                startIcon={<RiMoneyDollarCircleLine />}
                loading={isConfirming}
              >
                {t("confirm_payment")}
              </Button>
            </div>
          </>
        )}
      </section>
      <section>
        <div className="w-full my-2"></div>
      </section>
    </div>
  );
};
