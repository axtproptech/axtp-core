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

export interface CancellationArgs {
  reason: string;
  transactionId: string;
}

interface Props {
  open: boolean;
  payment: PaymentFullResponse;
  onClose: (args: CancellationArgs) => void;
}

export const CancelPaymentDialog = ({ payment, open, onClose }: Props) => {
  const { control, reset, getValues, watch } = useForm<CancellationArgs>({
    defaultValues: {
      reason: "",
      transactionId: "",
    },
  });

  const txIdValue = watch("transactionId");
  const reasonValue = watch("reason");

  const handleClose = () => {
    const { reason, transactionId } = getValues();
    reset();
    onClose({ transactionId, reason });
  };

  const canConfirm = !!txIdValue && !!reasonValue;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Button onClick={handleClose}>Abort</Button>
        <Button onClick={handleClose} disabled={!canConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
