import { ActionCard } from "@/app/components/cards";
import { IconSeeding } from "@tabler/icons";
import { Controller, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { useEffect, useState } from "react";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { useTheme } from "@mui/material/styles";

type FormValues = {
  amount: number;
};

export const MintActionCard = () => {
  const theme = useTheme();
  // @ts-ignore
  const { control, reset } = useForm<FormValues>({ amount: 0 });
  const [error, setError] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { token } = useMasterContract();

  const handleOnMintAction = () => {
    const amountQuantity = toStableCoinQuantity(floatAmount.toString(10));
    execute((service) => service.masterContract.requestMint(amountQuantity));
  };

  useEffect(() => {
    if (!transactionId) return;
    if (error && transactionId) {
      setError("");
    }
    reset();
  }, [transactionId]);

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
      title="Suggest Liquidity Minting"
      description="This action allows to raise the liquidity, e.g. when an interest holder bought some shares, or on other distributable earning."
      actionLabel="Suggest Minting"
      color="success"
      actionIcon={<IconSeeding />}
      onClick={handleOnMintAction}
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
