import { useTranslation } from "next-i18next";
import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Button, Textarea } from "react-daisyui";
import * as React from "react";
import { PasteButton } from "@/app/components/buttons/pasteButton";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";
import { Fade, Zoom } from "react-awesome-reveal";
import { AnimatedIconGlobe } from "@/app/components/animatedIcons/animatedIconGlobe";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { shortenHash } from "@/app/shortenHash";
import { AnimatedIconConfetti } from "@/app/components/animatedIcons/animatedIconConfetti";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { RegisterPaymentType } from "@/bff/types/registerPaymentRequest";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { useAccount } from "@/app/hooks/useAccount";
import { ChainValue } from "@signumjs/util";
import { Countdown } from "@/app/components/countdown";

interface Props {
  onStatusChange: (status: "pending" | "confirmed") => void;
  quantity: number;
  poolId: string;
  protocol: BlockchainProtocolType;
}

const MaxRetrials = 5;
const PollingInterval = 5_000;

export const StepPaymentUsdc3: FC<Props> = ({
  onStatusChange,
  quantity,
  poolId,
  protocol,
}) => {
  const { t } = useTranslation();
  const timer = useRef<any>(null);
  const { PaymentService } = useAppContext();
  const { accountPublicKey, customer } = useAccount();
  const [transactionHash, setTransactionHash] = useState<string>("");
  const { totalAXTC } = usePaymentCalculator(quantity, poolId);
  const { token } = useAppSelector(selectPoolContractState(poolId));
  const [txStatus, setTxStatus] = useState<
    "pending" | "confirmed" | "timedout"
  >("pending");

  function stopTimeout() {
    timer.current && clearTimeout(timer.current);
  }

  useEffect(() => {
    if (!transactionHash) return;

    let retrials = 0;

    const protocolToPaymentType = (
      p: BlockchainProtocolType
    ): RegisterPaymentType => {
      switch (p) {
        case "algo":
          return "usdalg";
        case "matic":
          return "usdmat";
        case "sol":
          return "usdsol";
        case "eth":
          return "usdeth";
        default:
          throw new Error(`Unknown protocol type [${p}]`);
      }
    };

    async function checkPaymentStatus() {
      if (!customer) {
        return;
      }

      try {
        if (retrials++ >= MaxRetrials) {
          setTxStatus("timedout");
          return;
        }
        // throws if status is not confirmed
        await PaymentService.getUsdcPaymentStatus(transactionHash, protocol);
        await PaymentService.createPaymentRecord({
          poolId,
          paymentType: protocolToPaymentType(protocol),
          amount: totalAXTC.toString(),
          usd: totalAXTC.toString(),
          currency: "USDC",
          txId: transactionHash,
          tokenId: token.id,
          customerId: customer.customerId,
          accountPk: accountPublicKey,
          tokenQnt: ChainValue.create(token.decimals)
            .setCompound(quantity)
            .getCompound(),
        });
        setTxStatus("confirmed");
        onStatusChange("confirmed");
      } catch (e: any) {
        timer.current = setTimeout(checkPaymentStatus, PollingInterval);
      }
    }

    stopTimeout();
    timer.current = setTimeout(checkPaymentStatus, PollingInterval);

    return () => {
      stopTimeout();
    };
  }, [PaymentService, protocol, transactionHash]);

  const handleChange = (e: FormEvent<HTMLTextAreaElement>) => {
    // @ts-ignore
    setTransactionHash(e.target.value);
  };

  const handlePaste = (text: string) => {
    setTransactionHash(text);
  };

  const handleCancel = () => {
    stopTimeout();
    setTransactionHash("");
  };

  const handleRetry = () => {
    stopTimeout();
    setTransactionHash("");
    setTxStatus("pending");
  };

  const { statusMessage, hint } = useMemo(() => {
    if (!transactionHash) {
      return {
        statusMessage: t("transaction_verification"),
        hint: null,
      };
    }
    if (txStatus === "confirmed") {
      return {
        statusMessage: t("transaction_verified"),
        hint: <p>{t("payment_success_hint")}</p>,
      };
    }
    if (txStatus === "timedout") {
      return {
        statusMessage: t("transaction_timedout"),
        hint: <p>{t("transaction_timedout_hint")}</p>,
      };
    }

    return {
      statusMessage: t("transaction_verifying"),
      hint: (
        <div className="w-[96px] mx-auto m-0">
          <Countdown
            className="text-xl"
            seconds={Math.ceil((MaxRetrials + 1) * (PollingInterval / 1000))}
            onTimeout={() => null}
          />
        </div>
      ),
    };
  }, [transactionHash, txStatus, t]);

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox className="text-center font-bold" text={statusMessage}>
          {hint}
        </HintBox>
        <div className="mt-4 mx-auto">
          {!transactionHash && (
            <>
              <Textarea
                className="w-[75%] text-justify border-base-content text-lg"
                onChange={handleChange}
                value={transactionHash}
                placeholder={t("enter_transaction_hash")}
                aria-label={t("enter_transaction_hash")}
                rows={3}
                disabled={!!transactionHash}
              />
              <PasteButton onText={handlePaste} disabled={!!transactionHash} />
            </>
          )}

          {transactionHash && txStatus === "pending" && (
            <>
              <Fade>
                <div className="w-[96px] mx-auto">
                  <AnimatedIconGlobe loopDelay={2000} loop />
                </div>
                <p>{shortenHash(transactionHash)}</p>
              </Fade>
              <Button onClick={handleCancel}>{t("cancel")}</Button>
            </>
          )}

          {transactionHash && txStatus === "confirmed" && (
            <Zoom>
              <div className="w-[120px] mx-auto">
                <AnimatedIconConfetti touchable loopDelay={2500} />
              </div>
            </Zoom>
          )}

          {transactionHash && txStatus === "timedout" && (
            <>
              <Fade>
                <div className="w-[96px] mx-auto">
                  <AnimatedIconError loopDelay={2000} />
                </div>
              </Fade>
              <Button onClick={handleRetry}>{t("retry")}</Button>
            </>
          )}
        </div>
      </section>
      <section></section>
    </div>
  );
};
