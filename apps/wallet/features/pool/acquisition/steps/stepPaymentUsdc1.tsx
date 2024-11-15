import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect } from "react";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import {
  RiArrowLeftCircleLine,
  RiArrowRightCircleLine,
  RiHome6Line,
} from "react-icons/ri";
import * as React from "react";
import { AnimatedIconGlobe } from "@/app/components/animatedIcons/animatedIconGlobe";
import { FormWizardStepProps } from "@/app/components/formWizard";
import { AcquisitionFormData } from "../acquisitionFormData";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { Fade } from "react-awesome-reveal";

export const StepPaymentUsdc1 = ({
  data: { usdcProtocol },
  nextStep,
  previousStep,
  updateData,
}: FormWizardStepProps<AcquisitionFormData>) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        onClick: previousStep,
        icon: <RiArrowLeftCircleLine />,
      },
      {
        route: "/",
        icon: <RiHome6Line />,
        label: t("home"),
      },
      {
        onClick: nextStep,
        label: t("next"),
        icon: <RiArrowRightCircleLine />,
      },
    ]);
  }, []);

  const handleProtocolChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateData("usdcProtocol", e.target.name);
  };

  return (
    <Fade className="opacity-0">
      <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto px-2">
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
                  checked={usdcProtocol === "eth"}
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
                  checked={usdcProtocol === "matic"}
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
    </Fade>
  );
};
