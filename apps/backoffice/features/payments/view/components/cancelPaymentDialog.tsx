import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "@/app/components/inputs";
import { PaymentFullResponse } from "@/bff/types/paymentFullResponse";
import { Number } from "@/app/components/number";
import { useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";

export interface CancellationArgs {
  reason: string;
  transactionId: string;
}

interface Props {
  open: boolean;
  payment: PaymentFullResponse;
  onClose: (args: CancellationArgs) => Promise<void>;
  onCancel: () => void;
}

export const CancelPaymentDialog = ({
  payment,
  open,
  onClose,
  onCancel,
}: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const { control, reset, getValues, watch } = useForm<CancellationArgs>({
    defaultValues: {
      reason: "",
      transactionId: "",
    },
  });

  const txIdValue = watch("transactionId");
  const reasonValue = watch("reason");

  const handleConfirm = async () => {
    const { reason, transactionId } = getValues();
    try {
      setIsClosing(true);
      await onClose({ transactionId, reason });
      reset();
    } finally {
      setIsClosing(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const canConfirm = !!txIdValue && !!reasonValue;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Cancel Payment</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1">
            You are about to cancel the payment of&nbsp;
            <Number value={payment.usd} decimals={2} suffix="USD" />
            <ol>
              <li>
                Do the reimbursement transaction and provide the transaction
                identifier
              </li>
              <li>Enter a reason for the cancellation</li>
            </ol>
          </Typography>
        </DialogContentText>
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              label="Transaction Id"
              placeholder="Enter the transaction id (PIX or USDC)"
              aria-autocomplete="none"
            />
          )}
          name="transactionId"
          control={control}
          // @ts-ignore
          variant="outlined"
          rules={{
            required: true,
          }}
        />
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              label="Reason"
              // @ts-ignore
              multiline
              maxRows={6}
              placeholder="Enter the reason of cancellation"
            />
          )}
          name="reason"
          control={control}
          // @ts-ignore
          variant="outlined"
          rules={{
            maxLength: 512,
            required: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Abort</Button>
        <ActionButton
          actionLabel="Confirm"
          onClick={handleConfirm}
          disabled={!canConfirm}
          isLoading={isClosing}
        />
      </DialogActions>
    </Dialog>
  );
};
