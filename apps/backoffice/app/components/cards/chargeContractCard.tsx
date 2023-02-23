import { IconRecharging } from "@tabler/icons";
import { Box, Typography, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { Config } from "@/app/config";
import { FC, useState } from "react";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { Amount } from "@signumjs/util";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { ActionCard } from "@/app/components/cards";
import { ConfirmedTransaction } from "@signumjs/wallets";

type FormValues = {
  amount: number;
};

interface Props {
  onRecharge: (amount: Amount) => Promise<ConfirmedTransaction>;
}

export const ChargeContractCard: FC<Props> = ({ onRecharge }) => {
  const theme = useTheme();
  const { ledgerService } = useLedgerService();
  const { showError, showSuccess } = useSnackbar();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);

  const { control, reset } = useForm<FormValues>({
    defaultValues: {
      amount: 10,
    },
  });

  const handleValueChange = (values: NumberFormatValues) => {
    const MinimumChargeValue = 1;
    if (
      values.floatValue !== undefined &&
      values.floatValue <= MinimumChargeValue
    ) {
      return setError(`Value must be greater than ${MinimumChargeValue}`);
    }

    if (values.floatValue !== undefined) {
      setFloatAmount(values.floatValue);
      setError("");
    }
  };

  const handleOnRechargeAction = async () => {
    if (!ledgerService) return;

    setIsSubmitting(true);
    setTransactionId("");
    try {
      const value = Amount.fromSigna(floatAmount);
      const tx = await onRecharge(value);
      setTransactionId(tx.transactionId);
      reset();
      showSuccess("Successfully charged contract");
    } catch (e: any) {
      showError(`Someting failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ActionCard
      title="Charge Contract"
      description="If a contract has not enough funds it stops during execution until it has sufficient funds again. With this action you can add more funds to the contract."
      actionIcon={<IconRecharging />}
      actionLabel="Charge Contract"
      onClick={handleOnRechargeAction}
      isLoading={isSubmitting}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <NumericFormat
              label={`Amount ${Config.Signum.TickerSymbol}`}
              color="primary"
              decimalScale={2}
              // @ts-ignore
              control={control}
              fixedDecimalScale={true}
              thousandSeparator={true}
              {...field}
              customInput={TextInput}
              onValueChange={handleValueChange}
            />
          )}
          name="amount"
          control={control}
          // @ts-ignore
          variant="outlined"
        />
      </Box>
      {error && (
        <Typography color={theme.palette.error.main}>{error}</Typography>
      )}
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
