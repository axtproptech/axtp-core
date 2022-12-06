import { useTranslation } from "next-i18next";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { usePaymentCalculator } from "@/features/pool/acquisition/steps/usePaymentCalculator";
import { HintBox } from "@/app/components/hintBox";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR from "swr";
import { Button, Input, Textarea } from "react-daisyui";
import * as React from "react";
import { PasteButton } from "@/app/components/buttons/pasteButton";
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
};

interface Props {
  onStatusChange: (status: "pending" | "paid") => void;
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
  const {
    PaymentService,
    Payment: { Usdc },
  } = useAppContext();
  const { totalAXTC } = usePaymentCalculator(quantity, poolId);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { data } = useSWR(
    transactionHash ? `/verifyTx/${transactionHash}` : null,
    async () => {
      try {
        const { status } = await PaymentService.getUsdcPaymentStatus(
          transactionHash,
          protocol
        );
        return status;
      } catch (e: any) {
        console.warn("Could not verify");
        return null;
      }
    },
    {
      refreshInterval: 5_000,
      errorRetryCount: 5,
    }
  );

  const handleChange = (e: FormEvent<HTMLTextAreaElement>) => {
    // @ts-ignore
    setTransactionHash(e.target.value);
  };

  const handlePaste = (text: string) => {
    setTransactionHash(text);
  };

  return (
    <div className="flex flex-col justify-between text-center h-[75vh] relative prose w-full mx-auto">
      <section className="mt-8">
        <HintBox text={t("transaction_verification")} />
        <div className="mt-4 relative flex flex-col w-[75%] mx-auto ">
          <Textarea
            className="w-full lg:w-[75%] text-justify border-base-content text-lg"
            onChange={handleChange}
            value={transactionHash}
            placeholder={t("enter_transaction_hash")}
            aria-label={t("enter_transaction_hash")}
            rows={3}
            disabled={!!transactionHash}
          />
        </div>
        <PasteButton onText={handlePaste} disabled={!!transactionHash} />
      </section>
      <section className="h-[240px]">
        {transactionHash && <h2>Checking...</h2>}
      </section>
    </div>
  );
};
