import { IconRecharging } from "@tabler/icons";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
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
  const { ledgerService } = useLedgerService();
  const { showError, showSuccess } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // @ts-ignore
  const { control, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      amount: 10,
    },
  });

  const handleOnRechargeAction = async () => {
    if (!ledgerService) return;

    setIsSubmitting(true);
    setTransactionId("");
    try {
      const { amount } = getValues();
      const value = Amount.fromSigna(amount);
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
            <NumberFormat
              label={`Amount ${Config.Signum.TickerSymbol}`}
              color="primary"
              decimalScale={2}
              allowEmptyFormatting={false}
              // @ts-ignore
              control={control}
              fixedDecimalScale={true}
              thousandSeparator={true}
              {...field}
              customInput={TextInput}
            />
          )}
          name="amount"
          control={control}
          // @ts-ignore
          variant="outlined"
        />
      </Box>
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
