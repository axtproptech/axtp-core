import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "@/app/components/inputs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import debounce from "lodash/debounce";
import { Account, Address } from "@signumjs/core";
import { SingleWithdrawalRequestInfo } from "@/features/withdrawals/singleRequest/singleWithdrawalRequestInfo";
import { ChainValue } from "@signumjs/util";
import IconButton from "@mui/material/IconButton";
import { Check as CheckIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

export interface ConfirmationArgs {
  paymentReference: string;
  paidTokenQuantity: string;
  paidFiatAmount: string;
  currency: "BRL" | "USD";
}

interface Props {
  open: boolean;
  onClose: (args: ConfirmationArgs) => Promise<void>;
  onCancel: () => void;
  withdrawalRequestInfo: SingleWithdrawalRequestInfo;
}

export const ConfirmPayoutDialog = ({
  open,
  onClose,
  onCancel,
  withdrawalRequestInfo,
}: Props) => {
  const mountedRef = useRef<boolean>(false);

  const tokenAmount = ChainValue.create(
    withdrawalRequestInfo.tokenInfo.decimals
  ).setAtomic(withdrawalRequestInfo.creditQuantity);

  const [isClosing, setIsClosing] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const { control, reset, getValues, watch } = useForm<ConfirmationArgs>({
    defaultValues: {
      paymentReference: "",
      paidFiatAmount: "",
      paidTokenQuantity: tokenAmount.getCompound(),
      currency: "BRL", // only pix allowed atm
    },
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleConfirm = async () => {
    try {
      setIsClosing(true);
      await onClose(getValues());
      reset();
    } finally {
      setIsClosing(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Confirm Payout</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1">
            Confirm that and how much {withdrawalRequestInfo.tokenInfo.name}{" "}
            will be paid to the token holder. Once confirmed it will be
            registered as a permanent record on the blockchain.
          </Typography>
        </DialogContentText>
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              label={`${withdrawalRequestInfo.tokenInfo.name} Amount`}
              placeholder="Enter the amount of paid "
              aria-autocomplete="none"
            />
          )}
          name="paidTokenQuantity"
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
              label="Payment Reference"
              placeholder="Enter the payment reference, i.e. identifier of Pix, or other"
              aria-autocomplete="none"
            />
          )}
          name="paymentReference"
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
          isLoading={isClosing}
        />
      </DialogActions>
    </Dialog>
  );
};
