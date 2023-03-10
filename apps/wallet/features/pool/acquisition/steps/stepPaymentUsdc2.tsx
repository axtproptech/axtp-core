import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { HintBox } from "@/app/components/hintBox";
import QRCode from "react-qr-code";
import { CopyButton } from "@/app/components/buttons/copyButton";
import { AnimatedIconQrCode } from "@/app/components/animatedIcons/animatedIconQrCode";
import { useAppContext } from "@/app/hooks/useAppContext";
import * as React from "react";
import { formatNumber } from "@/app/formatNumber";
import { shortenHash } from "@/app/shortenHash";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";

const NetworkResourceMap = {
  eth: {
    img: "/assets/img/ethereum-logo.svg",
    label: "Ethereum",
  },
  algo: {
    img: "/assets/img/algorand-logo.svg",
    label: "Algorand",
  },
  sol: {
    img: "/assets/img/solanaLogoMark.svg",
    label: "Solana",
  },
  matic: {
    img: "/assets/img/polygon-matic-logo.svg",
    label: "Polygon",
  },
};

interface Props {
  quantity: number;
  poolId: string;
  protocol: BlockchainProtocolType;
}

export const StepPaymentUsdc2: FC<Props> = ({ quantity, poolId, protocol }) => {
  const { t } = useTranslation();
  const {
    Payment: { Usdc },
  } = useAppContext();
  const { totalAXTC } = usePaymentCalculator(quantity, poolId);
  const [depositAddress, setDepositAddress] = useState<string>(
    Usdc.DepositAccountEth
  );

  useEffect(() => {
    switch (protocol) {
      case "algo":
        return setDepositAddress(Usdc.DepositAccountAlgo);
      case "sol":
        return setDepositAddress(Usdc.DepositAccountSol);
      case "matic":
        return setDepositAddress(Usdc.DepositAccountMatic);
      case "eth":
      default:
        return setDepositAddress(Usdc.DepositAccountEth);
    }
  }, [protocol]);

  // @ts-ignore
  const { label, img } = NetworkResourceMap[protocol];

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox className="my-0">
          <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
            <AnimatedIconQrCode loopDelay={5000} touchable />
          </div>
          <div className="text-center">
            <h4 className="my-1">
              {t("acquire_about_to_buy", {
                count: quantity,
                amount: formatNumber({ value: totalAXTC, suffix: "USDC" }),
              })}
            </h4>
            <small>{t("usdc_payments_description")}</small>
          </div>
        </HintBox>
      </section>
      <section className="w-[300px] mx-auto">
        <div className="bg-white rounded p-2 max-w-[140px] lg:max-w-[180px] mx-auto relative">
          <div className="flex flex-row items-center justify-center text-base-100">
            <img className="m-0 mr-1 pb-1 h-[20px]" src={img} />
            <small>{label}</small>
          </div>
          <div className={`${!depositAddress ? "blur-sm" : ""}`}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={depositAddress}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
        <small className="mt-0.5">{shortenHash(depositAddress, 20)}</small>
        <CopyButton textToCopy={depositAddress} />
      </section>
      <section></section>
    </div>
  );
};
