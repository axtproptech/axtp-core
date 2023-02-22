import { IconFlame } from "@tabler/icons";
import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  NumericFormat,
  NumberFormatValues,
  numericFormatter,
} from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { useTheme } from "@mui/material/styles";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { FC, useEffect, useState } from "react";
import { ActionCard } from "@/app/components/cards";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { Undo } from "@mui/icons-material";

type FormValues = {
  amount: number;
};

interface Props {
  onRefund: (quantity: number) => Promise<ConfirmedTransaction>;
  poolId: string;
}
export const RefundActionCard: FC<Props> = ({ onRefund, poolId }) => {
  const theme = useTheme();
  // @ts-ignore
  const { control, reset } = useForm<FormValues>({ amount: 0 });
  const [error, setError] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { token: masterToken } = useMasterContract();
  const poolContractState = useAppSelector(selectPoolContractState(poolId));

  const handleOnRefundAction = async () => {
    const amountQuantity = toStableCoinQuantity(floatAmount.toString(10));
    await execute(() => onRefund(amountQuantity));
  };

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

    const MaximumValue = poolContractState.pendingDistribution.toString(10);
    if (
      values.floatValue !== undefined &&
      values.floatValue > parseFloat(MaximumValue)
    ) {
      return setError(
        `Value must less than ${numericFormatter(MaximumValue, {
          decimalScale: 2,
        })}`
      );
    }
    if (values.floatValue !== undefined) {
      setFloatAmount(values.floatValue);
    }
    setError("");
  };
  return (
    <ActionCard
      title={`Suggest ${masterToken.name} Refunding`}
      description={`This action allows to refund the ${masterToken.name} back to the master contract. This reduces the amount of dividend payouts.`}
      actionIcon={<Undo />}
      actionLabel="Suggest Refunding"
      color="warning"
      onClick={handleOnRefundAction}
      isLoading={isExecuting}
      disabled={!!error}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <NumericFormat
              label={`Amount ${masterToken.name}`}
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
            value={poolContractState.pendingDistribution}
            displayType="text"
            decimalScale={2}
            suffix={` ${masterToken.name}`}
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
