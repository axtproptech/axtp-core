import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/router";
import { WithdrawalFormData } from "../../types/withdrawalFormData";
import { useAXTCTokenInfo } from "@/app/hooks/useAXTCTokenInfo";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { selectBrlUsdMarketData } from "@/app/states/marketState";
import { useSelector } from "react-redux";
import { Config } from "@/app/config";
import { formatNumber } from "@/app/formatNumber";
import { Input } from "react-daisyui";

export const Step1WithdrawalAmount = () => {
  const { locale } = useRouter();
  const { t } = useTranslation("withdrawal");
  const axtcToken = useAXTCTokenInfo();
  const { current_price } = useSelector(selectBrlUsdMarketData);

  const {
    accountData: { balanceAXTC },
  } = useAccount();
  const { control, watch } = useFormContext<WithdrawalFormData>();

  const perUsd = current_price - Config.Market.BrlUsdAdjustment;
  const fiatBalance = Number(balanceAXTC) * perUsd;
  const withdrawalAmount = watch("amount");
  const fiatWithdrawal = Number(withdrawalAmount) * perUsd;

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <section>
        <h3>{t("amount_title")}</h3>
      </section>
      <section className="mb-4">
        <HintBox text={t("amount_hint_title")}>
          <p>
            <strong className="text-justify">
              {t("amount_available", {
                value: balanceAXTC,
                token: axtcToken.name,
              })}
            </strong>
          </p>
          <small>
            {t("amount_estimated_fiat", {
              value: formatNumber({
                value: fiatBalance,
                decimals: 2,
                language: locale,
              }),
            })}
          </small>
        </HintBox>
      </section>
      <section className="flex flex-col justify-center mt-[10%]">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              // @ts-ignore
              inputRef={field.ref}
              decimalScale={2}
              fixedDecimalScale={true}
              thousandSeparator={true}
              customInput={Input}
              allowNegative={false}
              label={t("amount", { token: axtcToken.name })}
              placeholder={t("amount_placeholder")}
              onChange={undefined}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
              isAllowed={({ floatValue }) => {
                return floatValue ? floatValue <= Number(balanceAXTC) : true;
              }}
              suffix={` ${axtcToken.name}`}
              size="lg"
              className="font-semibold w-full"
              autoComplete="off"
            />
          )}
          rules={{
            validate: (v) => v >= 1 && v <= Number(balanceAXTC),
          }}
        />
        <small>
          {t("amount_estimated_fiat", {
            value: formatNumber({
              value: fiatWithdrawal,
              decimals: 2,
              language: locale,
            }),
          })}
        </small>
      </section>
    </div>
  );
};
