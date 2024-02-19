import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/router";
import { useNotification } from "@/app/hooks/useNotification";
import { useCallback, useState } from "react";
import { WithdrawalFormData } from "../../types/withdrawalFormData";
import { useAXTCTokenInfo } from "@/app/hooks/useAXTCTokenInfo";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { selectBrlUsdMarketData } from "@/app/states/marketState";
import { useSelector } from "react-redux";
import { Config } from "@/app/config";
import { formatNumber } from "@/app/formatNumber";
import { Button } from "react-daisyui";
import { PinInput } from "@/app/components/pinInput";
import { KeyError } from "@/types/keyError";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { ChainValue } from "@signumjs/util";
import { Numeric } from "@/app/components/numeric";
import { useAppContext } from "@/app/hooks/useAppContext";
import { tryCall } from "@axtp/core/common/tryCall";
import { RequestWithdrawalRequest } from "@/bff/types/requestWithdrawalRequest";

export const Step2ConfirmWithPin = () => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("withdrawal");
  const axtcToken = useAXTCTokenInfo();
  const { getKeys, customer } = useAccount();
  const { showError, showSuccess } = useNotification();
  const { current_price } = useSelector(selectBrlUsdMarketData);
  const ledgerService = useLedgerService();
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { BffClient } = useAppContext();
  const { watch } = useFormContext<WithdrawalFormData>();

  const perUsd = current_price - Config.Market.BrlUsdAdjustment;
  const withdrawalAmount = watch("amount");
  const fiatWithdrawal = Number(withdrawalAmount) * perUsd;

  const propagateWithdrawalRequest = useCallback(
    (payload: RequestWithdrawalRequest) => {
      return tryCall(async () => BffClient.post("withdrawal", payload));
    },
    [BffClient]
  );

  const handleConfirmWithdrawal = async () => {
    if (!ledgerService || !customer) return;
    try {
      setIsProcessing(true);
      const keys = await getKeys(pin);
      const amount = ChainValue.create(axtcToken.decimals).setCompound(
        withdrawalAmount
      );
      const tx = await ledgerService.burnContract.requestWithdrawal({
        tokenId: axtcToken.id,
        amount,
        keys,
      });

      await propagateWithdrawalRequest({
        tokenId: axtcToken.id,
        currency: "BRL",
        customerId: customer.customerId,
        tokenName: axtcToken.name,
        txId: tx?.transaction ?? "",
        tokenQnt: amount.getCompound(),
      });
      await router.replace(
        `/account/withdrawal/success?token=${axtcToken.name}&amount=${withdrawalAmount}&currency=BRL`
      );

      showSuccess(t("confirm_withdrawal_success"));
    } catch (e: any) {
      if (e instanceof KeyError) {
        showError(t("wrong_pin"));
      } else {
        showError(t("confirm_withdrawal_error"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <section>
        <h3>{t("confirm_withdrawal_title")}</h3>
      </section>
      <section className="mb-4">
        <HintBox
          text={t("confirm_withdrawal_hint", {
            value: withdrawalAmount,
            token: axtcToken.name,
          })}
        >
          <div className="flex flex-col justify-center items-center">
            <h3>
              <Numeric
                value={withdrawalAmount}
                suffix={axtcToken.name}
                decimals={axtcToken.decimals}
                language={locale}
              />
            </h3>
            <small>
              {t("amount_estimated_fiat", {
                value: formatNumber({
                  value: fiatWithdrawal,
                  decimals: 2,
                  language: locale,
                }),
              })}
            </small>
          </div>
        </HintBox>
      </section>
      <section className="flex flex-col justify-center mt-[10%]">
        <PinInput onPinChange={setPin} />
        <div className={"mt-4"}>
          <Button
            color="secondary"
            onClick={handleConfirmWithdrawal}
            disabled={pin.length < 5}
            loading={isProcessing}
          >
            {t("confirm")}
          </Button>
        </div>
      </section>
    </div>
  );
};
