import { ActionCard } from "@/app/components/cards";
import { Controller, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { FC, useEffect, useState } from "react";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { useTheme } from "@mui/material/styles";
import { Payments } from "@mui/icons-material";

type FormValues = {
  amount: number;
};

interface Props {
  poolId: string;
}

export const PayoutActionCard: FC<Props> = ({ poolId }) => {
  const theme = useTheme();
  // @ts-ignore
  const { control, reset } = useForm<FormValues>({ amount: 0 });
  const [error, setError] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { token } = useMasterContract();
  const handleOnRequestPayoutAction = async () => {
    const amountQuantity = toStableCoinQuantity(floatAmount.toString(10));
    await execute((service) =>
      service.masterContract.requestSendToPool(amountQuantity, poolId)
    );
  };

  useEffect(() => {
    if (!transactionId) return;
    if (error && transactionId) {
      setError("");
    }
    reset();
  }, [error, reset, transactionId]);

  const handleValueChange = (values: NumberFormatValues) => {
    const MinimumValue = 1;
    if (values.floatValue !== undefined && values.floatValue <= MinimumValue) {
      return setError(`Value must be greater than ${MinimumValue}`);
    }

    if (values.floatValue !== undefined) {
      setFloatAmount(values.floatValue);
    }

    setError("");
  };

  return (
    <ActionCard
      title="Suggest Dividend Payout"
      description="This action allows to request the payout of dividends to the current token holders."
      actionLabel="Suggest Payout"
      color="success"
      actionIcon={<Payments />}
      onClick={handleOnRequestPayoutAction}
      isLoading={isExecuting}
      disabled={!!error}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <NumericFormat
              label={`Amount ${token.name.toUpperCase()}`}
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
