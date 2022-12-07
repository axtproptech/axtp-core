import { useTranslation } from "next-i18next";
import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { HintBox } from "@/app/components/hintBox";
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

interface Props {
  onStatusChange: (status: "pending" | "confirmed") => void;
  quantity: number;
  poolId: string;
  protocol: BlockchainProtocolType;
}

export const StepPaymentUsdc3: FC<Props> = ({
  onStatusChange,
  quantity,
  poolId,
  protocol,
}) => {
  const { t } = useTranslation();
  const timer = useRef<any>(null);
  const { PaymentService } = useAppContext();
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [txStatus, setTxStatus] = useState<
    "pending" | "confirmed" | "timedout"
  >("pending");

  function stopTimeout() {
    timer.current && clearTimeout(timer.current);
  }

  useEffect(() => {
    if (!transactionHash) return;

    let retrials = 0;

    async function checkPaymentStatus() {
      try {
        if (retrials++ > 10) {
          setTxStatus("timedout");
        }
        await PaymentService.getUsdcPaymentStatus(transactionHash, protocol);
        setTxStatus("confirmed");
        onStatusChange("confirmed");
      } catch (e: any) {
        timer.current = setTimeout(checkPaymentStatus, 5_000);
      }
    }

    timer.current = setTimeout(checkPaymentStatus, 5_000);

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

  const statusMessage = useMemo(() => {
    if (!transactionHash) {
      return t("transaction_verification");
    }
    if (txStatus === "confirmed") {
      return t("transaction_verified");
    }
    if (txStatus === "timedout") {
      return t("transaction_timedout");
    }

    return t("transaction_verifying");
  }, [transactionHash, txStatus, t]);

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox className="text-center font-bold" text={statusMessage}>
          {txStatus === "timedout" && <p>{t("transaction_timedout_hint")}</p>}
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
