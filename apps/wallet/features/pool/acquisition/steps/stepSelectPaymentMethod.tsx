import { useTranslation } from "next-i18next";
import { FC, FormEvent, useMemo, useState } from "react";
import { HintBox } from "@/app/components/hintBox";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { Number } from "@/app/components/number";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";

interface Props {
  onMethodChange: (quantity: number) => void;
}

export const StepSelectPaymentMethod: FC<Props> = ({ onMethodChange }) => {
  const { t } = useTranslation();
  const { name } = useAppSelector(selectAXTToken);
  const [method, setMethod] = useState<"pix" | "usdc">("pix");

  const handleMethodChange = (e: FormEvent) => {
    console.log("handleMethodChange", e);
    // @ts-ignore
    setMethod(e.target.name);
    // onMethodChange(q);
  };

  return (
    <div className="flex flex-col justify-between h-[50vh] text-center relative prose w-full mx-auto">
      <section className="mt-8">
        <h2 className="my-1">{t("acquire_token")}</h2>
        <h4 className="mb-8">{t("acquire_how_many")}</h4>
      </section>
      <section>
        <div className="relative flex flex-col mx-auto w-1/2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">PIX</span>
              <input
                type="radio"
                className="radio"
                name="pix"
                checked={method === "pix"}
                onChange={handleMethodChange}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">USDC</span>
              <input
                type="radio"
                className="radio"
                name="usdc"
                checked={method === "usdc"}
                onChange={handleMethodChange}
              />
            </label>
          </div>
        </div>
      </section>
      <section>
        <HintBox>
          <div className="absolute w-[64px] top-[-48px] bg-base-100">
            <AnimatedIconCoins loopDelay={5000} touchable />
          </div>
          <div className="text-lg text-center">
            <h4 className="m-0 mb-1">{t("acquire_totalPrice")}</h4>
          </div>
        </HintBox>
      </section>
    </div>
  );
};
