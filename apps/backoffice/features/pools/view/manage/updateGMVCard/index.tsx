import { IconRocket } from "@tabler/icons";
import { Box, Typography, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { FC, useState } from "react";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { ActionCard } from "@/app/components/cards";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { toStableCoinQuantity } from "@/app/tokenQuantity";

type FormValues = {
  amount: number;
};

interface Props {
  onUpdate: (quantity: number) => Promise<ConfirmedTransaction>;
  currentGMV: number;
}

export const UpdateGMVCard: FC<Props> = ({ onUpdate, currentGMV }) => {
  const theme = useTheme();
  const { ledgerService } = useLedgerService();
  const { token } = useMasterContract();
  const { showError, showSuccess } = useSnackbar();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [floatAmount, setFloatAmount] = useState(0.0);

  // @ts-ignore
  const { control, reset } = useForm<FormValues>({
    defaultValues: {
      amount: currentGMV,
    },
  });

  const handleValueChange = (values: NumberFormatValues) => {
    const MinimumValue = 1;
    if (values.floatValue !== undefined && values.floatValue <= MinimumValue) {
      return setError(`Value must be greater than ${MinimumValue}`);
    }

    if (values.floatValue !== undefined) {
      setFloatAmount(values.floatValue);
    }
  };

  const handleOnUpdateAction = async () => {
    if (!ledgerService) return;

    setIsSubmitting(true);
    setTransactionId("");
    try {
      const value = toStableCoinQuantity(floatAmount);
      const tx = await onUpdate(value);
      setTransactionId(tx.transactionId);
      reset();
      showSuccess("Successfully updated GMV");
    } catch (e: any) {
      showError(`Something failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ActionCard
      title="Update Gross Market Value (GMV)"
      description="This action permits adjusting the Gross Market Value. This value expresses the value growth of the pools assets."
      actionIcon={<IconRocket />}
      actionLabel="Update GMV"
      onClick={handleOnUpdateAction}
      isLoading={isSubmitting}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <NumericFormat
              label={`Amount ${token.name}`}
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
