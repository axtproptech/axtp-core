import { useTranslation } from "next-i18next";
import { FC, FormEvent, useMemo, useState } from "react";
import { HintBox } from "@/app/components/hintBox";
import * as React from "react";
import { AttentionSeeker } from "react-awesome-reveal";

export type PaymentMethod = "pix" | "usdc";

interface Props {
  onMethodChange: (method: PaymentMethod) => void;
}

export const StepSelectPaymentMethod: FC<Props> = ({ onMethodChange }) => {
  const { t } = useTranslation();
  const [method, setMethod] = useState<PaymentMethod>("pix");

  const handleMethodChange = (e: FormEvent) => {
    // @ts-ignore
    const method = e.target.name;
    setMethod(method);
    onMethodChange(method);
  };

  const icon = useMemo(() => {
    switch (method) {
      case "usdc":
        return (
          <img className="m-2 h-[32px]" src="/assets/img/usd-coin-logo.svg" />
        );
      case "pix":
        return <img className="m-2 h-[32px]" src="/assets/img/pix-logo.svg" />;
      default:
    }
  }, [method]);

  return (
    <div className="flex flex-col justify-between text-center relative prose w-full mx-auto">
      <section className="mt-8">
        <h2 className="my-1">{t("acquire_select_method")}</h2>
      </section>
      <section className="h-[240px]">
        <div className="relative flex flex-col mx-auto w-1/4 mb-8">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="text-lg">PIX</span>
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
              <span className="text-lg">USDC</span>
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
        <HintBox text={t(`acquire_method_${method}`)}>
          <div className="absolute top-[-24px] bg-base-100">
            <AttentionSeeker effect="heartBeat" delay={2000}>
              {icon}
            </AttentionSeeker>
          </div>
        </HintBox>
      </section>
      <section />
    </div>
  );
};
