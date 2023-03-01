import { CustomerPaymentData } from "@/types/customerPaymentData";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllPools } from "@/app/states/poolsState";
import { formatNumber } from "@/app/formatNumber";
import { HintBox } from "@/app/components/hintBox";
import { useTranslation } from "next-i18next";
import { AnimatedIconClock } from "@/app/components/animatedIcons/animatedIconClock";

interface SimplePayment {
  tokenName: string;
  tokenQuantity: number;
  axtc: number;
}

interface Props {
  payments: CustomerPaymentData[];
}

export const PaymentStatus: FC<Props> = ({ payments }) => {
  const pools = useSelector(selectAllPools);
  const { t } = useTranslation();

  const pending = useMemo(() => {
    const getTokenName = (poolId: string) => {
      const pool = pools.find((p) => p.poolId === poolId);
      return pool ? pool.token.name : "";
    };

    const simplePayments = payments
      .filter((p) => p.status === "Pending")
      .reduce((map, p) => {
        const mapped = map.get(p.tokenId);
        if (mapped) {
          mapped.tokenQuantity += Number(p.tokenQuantity);
          mapped.axtc += Number(p.usd);
        } else {
          const sp: SimplePayment = {
            axtc: Number(p.usd),
            tokenName: getTokenName(p.poolId),
            tokenQuantity: Number(p.tokenQuantity),
          };
          map.set(p.tokenId, sp);
        }

        return map;
      }, new Map<string, SimplePayment>());

    return Array.from(simplePayments.values());
  }, [payments, pools]);

  if (!pending.length) return null;

  return (
    <HintBox
      className="mx-auto"
      text={t("acquisition_in_progress", { count: pending.length })}
    >
      <div className="absolute w-[48px] top-[-32px] bg-base-100">
        <AnimatedIconClock loopDelay={5000} touchable />
      </div>
      <div className="flex flex-col justify-center">
        <div className="overflow-x-auto mx-auto">
          <ul className="w-full">
            {pending.map((p) => {
              return (
                <li key={p.tokenName}>{`${p.tokenQuantity} ${
                  p.tokenName
                } for ${formatNumber({ value: p.axtc, suffix: "USD" })}`}</li>
              );
            })}
          </ul>
        </div>
      </div>
    </HintBox>
  );
};
