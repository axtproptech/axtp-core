import { ActionCard } from "@/app/components/cards";
import { IconSend } from "@tabler/icons";
import { Controller, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import {
  NumberFormatValues,
  NumericFormat,
  numericFormatter,
} from "react-number-format";
import { TextInput, SelectInput, SelectOption } from "@/app/components/inputs";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { useEffect, useMemo, useState } from "react";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "@/states/hooks";
import { selectAllPools } from "@/app/states/poolsState";

type FormValues = {
  amount: number;
  pool: string;
};

export const SendToPoolActionCard = () => {
  const theme = useTheme();
  const { control, reset, watch } = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      pool: "0",
    },
  });
  const [error, setError] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const pools = useAppSelector(selectAllPools);
  const { token } = useMasterContract();
  const tokenName = token.name.toUpperCase();

  const pool = watch("pool");

  const handleOnSendAction = () => {
    const amountQuantity = toStableCoinQuantity(floatAmount.toString(10));
    const poolId = pools[Number(pool)].poolId;
    execute((service) =>
      service.masterContract.requestSendToPool(amountQuantity, poolId)
    );
  };

  const poolOptions = useMemo(() => {
    if (!pools) return [];

    return pools.map((p, index) => {
      return {
        value: index,
        label: p.token.name,
      } as SelectOption;
    });
  }, [pools]);

  useEffect(() => {
    if (!transactionId) return;
    if (error && transactionId) {
      setError("");
    }
    reset();
  }, [error, reset, transactionId]);

  const handleValueChange = (values: NumberFormatValues) => {
    const MinimumValue = 0.1;
    if (values.floatValue !== undefined && values.floatValue <= MinimumValue) {
      return setError(`Value must be greater than ${MinimumValue}`);
    }
    const maxBalance = parseFloat(token.balance);
    if (values.floatValue !== undefined && values.floatValue > maxBalance) {
      return setError(
        `Value must be less than ${numericFormatter(token.balance, {
          decimalScale: 2,
        })}`
      );
    }

    if (values.floatValue !== undefined) {
      setFloatAmount(values.floatValue);
    }
    setError("");
  };

  const canSubmit = !error && Number(pool) < pools.length && floatAmount > 0;

  return (
    <ActionCard
      title={`Suggest Send ${tokenName}`}
      description="This action sends liquidity to a selected pool. This has to be done to prepare a distribution to token holders. Pending approvals will be overwritten by this action."
      actionLabel="Suggest Send To Pool"
      color="success"
      actionIcon={<IconSend />}
      onClick={handleOnSendAction}
      isLoading={isExecuting}
      disabled={!canSubmit}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <SelectInput label="Select Pool" options={poolOptions} {...field} />
          )}
          name="pool"
          control={control}
          // @ts-ignore
          variant="outlined"
        />
        <Box sx={{ py: 1 }} />
        <Controller
          render={({ field }) => (
            <NumericFormat
              label={`Amount ${tokenName}`}
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
        <Typography>
          Available balance is&nbsp;
          <NumericFormat
            value={token.balance}
            displayType="text"
            decimalScale={2}
            suffix={` ${tokenName}`}
            fixedDecimalScale
            thousandSeparator
          />
        </Typography>
      </Box>
      {error && (
        <Typography color={theme.palette.error.main}>{error}</Typography>
      )}
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
