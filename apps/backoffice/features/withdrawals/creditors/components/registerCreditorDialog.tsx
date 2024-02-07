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
import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import debounce from "lodash/debounce";
import { Account, Address } from "@signumjs/core";

export interface RegistrationArgs {
  creditorAccountId: string;
}

interface Props {
  open: boolean;
  onClose: (args: RegistrationArgs) => Promise<void>;
  onCancel: () => void;
}

export const RegisterCreditorDialog = ({ open, onClose, onCancel }: Props) => {
  const mountedRef = useRef<boolean>(false);
  const [isClosing, setIsClosing] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const { ledgerService } = useLedgerService();
  const { control, reset, getValues, watch } = useForm<RegistrationArgs>({
    defaultValues: {
      creditorAccountId: "",
    },
  });
  const accountId = watch("creditorAccountId");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (ledgerService && accountId && mountedRef.current) {
      ledgerService.account
        .getAccount(accountId)
        .then((account) => {
          setResolvedAddress(account.accountRS);
        })
        .catch(() => {
          setResolvedAddress("");
        });
    }
  }, [ledgerService, accountId]);

  const handleConfirm = async () => {
    const { creditorAccountId } = getValues();
    try {
      setIsClosing(true);
      await onClose({
        creditorAccountId: Address.create(creditorAccountId).getNumericId(),
      });
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
        <Typography variant="h3">Register Creditor</Typography>
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
              label="Creditor Account"
              placeholder="Enter the creditors account id or address"
              aria-autocomplete="none"
              hint={
                resolvedAddress
                  ? `Found Account: ${resolvedAddress}`
                  : `Account not found`
              }
            />
          )}
          name="creditorAccountId"
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
          disabled={!resolvedAddress}
          isLoading={isClosing}
        />
      </DialogActions>
    </Dialog>
  );
};
