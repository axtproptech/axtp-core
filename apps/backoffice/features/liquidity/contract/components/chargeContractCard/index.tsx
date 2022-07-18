import { ActionCard } from "../../../components/actionCard";
import { IconRecharging } from "@tabler/icons";
import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { Config } from "@/app/config";
import { useState } from "react";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { Amount } from "@signumjs/util";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";

type FormValues = {
  amount: number;
};

export const ChargeContractCard = () => {
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
      const tx = await ledgerService.masterContract.rechargeContract(value);
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
      {transactionId && (
        <>
          <Typography variant="subtitle2">
            The transaction was successfully broadcast to the network. It takes
            about four minutes until it takes effect. You can trace the
            transaction in the networks explorer.
          </Typography>
          <OpenExplorerButton id={transactionId} type="tx" />
        </>
      )}
    </ActionCard>
  );
};
