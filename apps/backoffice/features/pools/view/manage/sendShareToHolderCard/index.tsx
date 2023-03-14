import { IconUsers, IconUserSearch } from "@tabler/icons";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { FC, useMemo, useState } from "react";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { ActionCard } from "@/app/components/cards";
import { ConfirmedTransaction } from "@signumjs/wallets";
import { toPoolShareQuantity } from "@/app/tokenQuantity";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import { Address } from "@signumjs/core";
import { customerService } from "@/app/services/customerService/customerService";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { useRouter } from "next/router";
import { useAppContext } from "@/app/hooks/useAppContext";
import { singleQueryArg } from "@/app/singleQueryArg";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { useSWRConfig } from "swr";

type FormValues = {
  amount: number;
  recipient: string;
  payment: string;
};

interface Props {
  onSend: (
    recipientId: string,
    quantity: number
  ) => Promise<ConfirmedTransaction>;
  poolId: string;
}

export const SendShareToHolderCard: FC<Props> = ({ onSend, poolId }) => {
  const theme = useTheme();
  const router = useRouter();
  const { query } = router;
  const amount = query.quantity
    ? parseFloat(singleQueryArg(query.quantity))
    : 1;
  const recipient = query.recipient ? singleQueryArg(query.recipient) : "";
  const payment = query.payment ? singleQueryArg(query.payment) : "";

  const { Ledger } = useAppContext();
  const { ledgerService } = useLedgerService();
  const { token } = usePoolContract(poolId);
  const { showError, showSuccess } = useSnackbar();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [floatAmount, setFloatAmount] = useState(amount);
  const { mutate } = useSWRConfig();

  // @ts-ignore
  const { control, reset, watch } = useForm<FormValues>({
    defaultValues: {
      amount,
      recipient,
      payment,
    },
  });

  const recipientValue = watch("recipient");
  const paymentValue = watch("payment");
  const address = useMemo(() => {
    if (!recipientValue) return null;
    try {
      return Address.create(recipientValue, Ledger.Prefix);
    } catch (e) {
      return null;
    }
  }, [Ledger.Prefix, recipientValue]);

  const handleValueChange = (values: NumberFormatValues) => {
    const MinimumValue = 1;
    if (values.floatValue !== undefined && values.floatValue <= MinimumValue) {
      return setError(`Value must be greater than ${MinimumValue}`);
    }

    if (values.floatValue !== undefined) {
      setFloatAmount(values.floatValue);
    }
  };

  const handleOnSendAction = async () => {
    if (!ledgerService || !address) return;

    setIsSubmitting(true);
    setTransactionId("");
    try {
      const value = toPoolShareQuantity(floatAmount);
      const accountId = address.getNumericId();
      const foundCustomer = await customerService.fetchCustomerByAccountId(
        accountId
      );
      if (!foundCustomer) {
        throw new Error("Given account is not registered");
      }
      let payService = paymentValue
        ? paymentsService.with(parseInt(paymentValue))
        : null;
      if (payService) {
        // checking for existing payment
        await payService.fetchPayment();
      }
      const tx = await onSend(accountId, value);
      if (payService) {
        await payService.setProcessed(tx.transactionId);
        await mutate(`getPayment/${payService.paymentId}`);
      }
      setTransactionId(tx.transactionId);
      reset();
      showSuccess("Successfully requested token send");
    } catch (e: any) {
      showError(`Something failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    return router.push("/admin/customers");
  };

  return (
    <ActionCard
      title="Send Share to Token Holder"
      description="With this action you can transfer a pool token to a specific holder"
      actionIcon={<IconUsers />}
      actionLabel="Send Share"
      onClick={handleOnSendAction}
      isLoading={isSubmitting}
      disabled={!address || !floatAmount}
    >
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" alignItems="center">
          <Controller
            render={({ field }) => (
              <TextInput label="Recipient Id" {...field} />
            )}
            name="recipient"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{ required: true }}
          />
          <Tooltip arrow title={"Search Token Holder"}>
            <div>
              <ActionButton
                actionLabel={""}
                color="grey"
                actionIcon={<IconUserSearch />}
                onClick={handleSearch}
                sx={{ ml: 1 }}
              />
            </div>
          </Tooltip>
        </Stack>
        <Typography>{address && address.getReedSolomonAddress()}</Typography>
        <Box sx={{ py: 1 }} />
        <Controller
          render={({ field }) => (
            <NumericFormat
              label={`Amount ${token.name}`}
              color="primary"
              decimalScale={0}
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

        <Box sx={{ py: 1 }} />
        <Controller
          render={({ field }) => <TextInput label="Payment Id" {...field} />}
          name="payment"
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
