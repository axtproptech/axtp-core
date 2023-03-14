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
import { useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";

export interface RegistrationArgs {
  transactionId: string;
}

interface Props {
  open: boolean;
  onClose: (args: RegistrationArgs) => Promise<void>;
  onCancel: () => void;
}

export const RegisterTransactionIdDialog = ({
  open,
  onClose,
  onCancel,
}: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const { control, reset, getValues, watch } = useForm<RegistrationArgs>({
    defaultValues: {
      transactionId: "",
    },
  });

  const txIdValue = watch("transactionId");

  const handleConfirm = async () => {
    const { transactionId } = getValues();
    try {
      setIsClosing(true);
      await onClose({ transactionId });
      reset();
    } finally {
      setIsClosing(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const canConfirm = !!txIdValue;

  // @ts-ignore
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Register Payment Transaction</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1">
            Verify, if the payment was done and enter the transaction reference
            here, i.e. PIX transaction code, DOC/TED reference etc.
          </Typography>
        </DialogContentText>
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              label="Transaction Id"
              placeholder="Enter the transaction id (PIX Code, DOC, TED)"
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
