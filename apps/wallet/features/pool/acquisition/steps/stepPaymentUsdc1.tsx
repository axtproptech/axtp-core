import { useTranslation } from "next-i18next";
import { FC, FormEvent, useEffect, useState } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { Numeric } from "@/app/components/numeric";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import QRCode from "react-qr-code";
import { CopyButton } from "@/app/components/buttons/copyButton";
import { AnimatedIconQrCode } from "@/app/components/animatedIcons/animatedIconQrCode";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";
import { NewPixPaymentResponse } from "@/bff/types/newPixPaymentResponse";
import { useAccount } from "@/app/hooks/useAccount";
import useSWR from "swr";
import { Button } from "react-daisyui";
import { RiClipboardLine, RiQrCodeFill } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";
import * as React from "react";
import { Countdown } from "@/app/components/countdown";
import { AnimatedIconGlobe } from "@/app/components/animatedIcons/animatedIconGlobe";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";

interface Props {
  onProtocolChange: (protocol: BlockchainProtocolType) => void;
  quantity: number;
  poolId: string;
}

export const StepPaymentUsdc1: FC<Props> = ({
  onProtocolChange,
  quantity,
  poolId,
}) => {
  const { t } = useTranslation();
  const [protocol, setProtocol] = useState<BlockchainProtocolType>("eth");

  const handleProtocolChange = (e: FormEvent) => {
    // @ts-ignore
    const method = e.target.name;
    setProtocol(method);
    onProtocolChange(method);
  };

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox className="my-0">
          <div className="absolute w-[64px] bottom-[-40px] right-[12px] bg-base-100">
            <AnimatedIconGlobe loopDelay={2500} touchable />
          </div>
          <div className="text-center">
            <h3 className="my-1">{t("usdc_select_network")}</h3>
            <small>{t("usdc_select_network_description")}</small>
          </div>
        </HintBox>
      </section>
      <section className="w-[300px] mx-auto">
        <div className="relative flex flex-col gap-2 text-left">
          <div className="form-control">
            <label className="label cursor-pointer">
              <div className="flex flex-row items-center m-0 p-0">
                <img
                  src="/assets/img/ethereum-logo.svg"
                  className="h-[32px] m-0 mr-2 scale-[1.2]"
                  alt="Ethereum Logo"
                />
                <div>
                  <div className="text-lg">Ethereum (ERC-20)</div>
                  <div className="text-xs flex flex-row items-center">
                    {t("blockchain_hint_eth")}
                    {/*<pre className="m-0 ml-1 p-1">0xab4f...744f</pre>*/}
                  </div>
                </div>
              </div>
              <input
                type="radio"
                className="radio"
                name="eth"
                checked={protocol === "eth"}
                onChange={handleProtocolChange}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <div className="flex flex-row items-center m-0 p-0">
                <img
                  src="/assets/img/polygon-matic-logo.svg"
                  className="h-[32px] m-0 mr-2 scale-[0.8]"
                  alt="Polygon Logo"
                />
                <div>
                  <div className="text-lg">Polygon (ERC-20)</div>
                  <div className="text-xs flex flex-row items-center">
                    {t("blockchain_hint_mat")}
                    {/*<pre className="m-0 ml-1 p-1">0xab4f...744f</pre>*/}
                  </div>
                </div>
              </div>
              <input
                type="radio"
                className="radio"
                name="matic"
                checked={protocol === "matic"}
                onChange={handleProtocolChange}
              />
            </label>
          </div>
          {/*<div className="form-control">*/}
          {/*  <label className="label cursor-pointer">*/}
          {/*    <div className="text-lg flex flex-row items-center m-0 p-0">*/}
          {/*      <img*/}
          {/*        src="/assets/img/solanaLogoMark.svg"*/}
          {/*        className="h-[32px] m-0 mr-2 scale-[0.8]"*/}
          {/*        alt="Solana Logo"*/}
          {/*      />*/}
          {/*      <div>*/}
          {/*        <div className="text-lg">Solana</div>*/}
          {/*        <div className="text-xs flex flex-row items-center">*/}
          {/*          {t("address_look_like")}&nbsp;*/}
          {/*          <pre className="m-0 ml-1 p-1">4zWa...87b8</pre>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <input*/}
          {/*      type="radio"*/}
          {/*      className="radio"*/}
          {/*      name="sol"*/}
          {/*      checked={protocol === "sol"}*/}
          {/*      onChange={handleProtocolChange}*/}
          {/*    />*/}
          {/*  </label>*/}
          {/*</div>*/}
          {/*  <div className="form-control">*/}
          {/*    <label className="label cursor-pointer">*/}
          {/*      <div className="text-lg flex flex-row items-center">*/}
          {/*        <img*/}
          {/*          src="/assets/img/algorand-logo.svg"*/}
          {/*          className="h-[32px] m-0 mr-2 scale-[0.9]"*/}
          {/*          alt="Algorand Logo"*/}
          {/*        />*/}
          {/*        <div>*/}
          {/*          <div className="text-lg">Algorand</div>*/}
          {/*          <div className="text-xs flex flex-row items-center">*/}
          {/*            {t("address_look_like")}&nbsp;*/}
          {/*            <pre className="m-0 ml-1 p-0">Y7QK....5LYQ</pre>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*      <input*/}
          {/*        type="radio"*/}
          {/*        className="radio"*/}
          {/*        name="algo"*/}
          {/*        checked={protocol === "algo"}*/}
          {/*        onChange={handleProtocolChange}*/}
          {/*      />*/}
          {/*    </label>*/}
          {/*  </div>*/}
        </div>
      </section>
      <section></section>
    </div>
  );
};
