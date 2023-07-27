import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { Number } from "@/app/components/number";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { PoolHeader } from "@/features/pool/components/poolHeader";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";

interface Props {
  maxAllowedShares: number;
  poolId: string;
  onQuantityChange: (quantity: number) => void;
}

export const StepSelectQuantity: FC<Props> = ({
  maxAllowedShares,
  onQuantityChange,
  poolId,
}) => {
  const { t } = useTranslation();
  const { name } = useAppSelector(selectAXTToken);
  const [quantity, setQuantity] = useState(1);
  const { totalAXTC, totalBRL, adjustedBrlUsdPrice } = usePaymentCalculator(
    quantity,
    poolId
  );

  const handleQuantityChange = (q: number) => () => {
    setQuantity(q);
    onQuantityChange(q);
  };

  const items = useMemo(() => {
    const a = [];
    for (let i = 1; i <= maxAllowedShares; ++i) {
      a.push(i);
    }
    return a;
  }, [maxAllowedShares]);

  if (maxAllowedShares === 0)
    return (
      <div className="overflow-hidden">
        <section className="mt-[25%] px-4">
          <HintBox text={t("max_token_reached")}>
            <div className="absolute w-[64px] top-[-48px] bg-base-100">
              <AnimatedIconCoins loopDelay={5000} touchable />
            </div>
            <p>{t("max_token_reached_hint")}</p>
          </HintBox>
        </section>
      </div>
    );

  return (
    <div className="flex flex-col justify-between h-[50vh] text-center relative prose w-full mx-auto">
      <section className="mt-8">
        <h2 className="my-1">{t("acquire_token")}</h2>
        <h4 className="mb-8">{t("acquire_how_many")}</h4>
      </section>
      <section>
        <div className="relative flex flex-col mx-auto">
          <div className="btn-group mx-auto">
            {items.map((i) => (
              <button
                key={`btn-${i}`}
                className={`btn ${i === quantity ? "btn-active" : ""}`}
                onClick={handleQuantityChange(i)}
              >
                {i}
              </button>
            ))}
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
            <h4>
              <Number value={totalAXTC} suffix={name} /> ={" "}
              <Number value={totalAXTC} suffix="USD" /> ={" "}
              <Number value={totalBRL} suffix="BRL" />
            </h4>
            <small>
              {`${t("effective_rate")} - 1 USD :`}
              &nbsp;
              <Number value={adjustedBrlUsdPrice} suffix="BRL" />
            </small>
          </div>
        </HintBox>
      </section>
    </div>
  );
};
