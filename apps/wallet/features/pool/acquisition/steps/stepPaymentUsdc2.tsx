import { useTranslation } from "next-i18next";
import { FC, FormEvent, useEffect, useState } from "react";
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
import { Button } from "react-daisyui";
import { RiClipboardLine, RiQrCodeFill } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";
import * as React from "react";
import { Countdown } from "@/app/components/countdown";
import { NetworkType } from "./stepPaymentUsdc1";

interface Props {
  onStatusChange: (status: "pending" | "paid") => void;
  quantity: number;
  poolId: string;
  network: NetworkType;
}

export const StepPaymentUsdc2: FC<Props> = ({
  onStatusChange,
  quantity,
  poolId,
  network,
}) => {
  const { t } = useTranslation();
  const {
    PaymentService,
    Payment: { Usdc },
  } = useAppContext();
  const { accountId, customer } = useAccount();
  const { totalBRL, totalAXTC } = usePaymentCalculator(quantity, poolId);
  const { showError, showSuccess } = useNotification();
  const [depositAddress, setDepositAddress] = useState<string>(
    Usdc.DepositAccountEth
  );

  useEffect(() => {
    switch (network) {
      case "algo":
        return setDepositAddress(Usdc.DepositAccountAlgo);
      case "sol":
        return setDepositAddress(Usdc.DepositAccountSol);
      case "eth":
      default:
        return setDepositAddress(Usdc.DepositAccountEth);
    }
  }, [network, showSuccess, t]);

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
              <Number value={totalAXTC} suffix="USDC" />
            </h3>
          </div>
        </HintBox>
      </section>
      <section className="w-[300px] mx-auto">
        <div className="bg-white rounded p-2 max-w-[200px] lg:max-w-[240px] mx-auto relative">
          <img
            className="m-0 pb-1 h-[28px] mx-auto"
            src="/assets/img/usd-coin-logo.svg"
          />
          <div className={`${!depositAddress ? "blur-sm" : ""}`}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={depositAddress}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
        <CopyButton textToCopy={depositAddress} />
      </section>
      <section></section>
    </div>
  );
};
