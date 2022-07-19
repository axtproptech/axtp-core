import { ActionCard } from "../../../components/actionCard";
import { IconFlame } from "@tabler/icons";
import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { useTheme } from "@mui/material/styles";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { useEffect, useState } from "react";

type FormValues = {
  amount: number;
};

export const BurnActionCard = () => {
  const theme = useTheme();
  // @ts-ignore
  const { control, reset } = useForm<FormValues>({ amount: 0 });
  const [error, setError] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { token } = useMasterContract();

  const handleOnBurnAction = () => {
    const amountQuantity = toStableCoinQuantity(floatAmount.toString(10));
    execute((service) => service.masterContract.requestBurn(amountQuantity));
  };

  useEffect(() => {
    if (!transactionId) return;
    if (error && transactionId) {
      setError("");
    }
    reset();
  }, [transactionId]);

  const handleValueChange = (values: NumberFormatValues) => {
    const MinimumValue = 0.1;
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
      title="Suggest Liquidity Burning"
      description="This action allows to lower the liquidity, e.g. when an interest holder sold his shares."
      actionIcon={<IconFlame />}
      actionLabel="Suggest Burning"
      color="warning"
      onClick={handleOnBurnAction}
      isLoading={isExecuting}
      disabled={!!error}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <NumberFormat
              label={`Amount ${token.name.toUpperCase()}`}
              color="primary"
              decimalScale={2}
              allowEmptyFormatting={false}
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
