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
import { useEffect, useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { SingleWithdrawalRequestInfo } from "../singleWithdrawalRequestInfo";
import { ChainValue } from "@signumjs/util";

interface FormArgs {
  reason: string;
  refusedTokenAmount: string;
  currency: "BRL" | "USD";
}

export interface DenialArgs extends FormArgs {}

interface Props {
  open: boolean;
  onClose: (args: DenialArgs) => Promise<void>;
  onCancel: () => void;
  withdrawalRequestInfo: SingleWithdrawalRequestInfo;
}

const DefaultFiatCurrency = "BRL";

export const DenyPayoutDialog = ({
  open,
  onClose,
  onCancel,
  withdrawalRequestInfo,
}: Props) => {
  const tokenName = withdrawalRequestInfo.tokenInfo.name;
  const tokenAmount = ChainValue.create(
    withdrawalRequestInfo.tokenInfo.decimals
  ).setAtomic(withdrawalRequestInfo.creditQuantity);

  const [isClosing, setIsClosing] = useState(false);
  const { control, reset, getValues, watch, setValue, setError } =
    useForm<FormArgs>({
      defaultValues: {
        reason: "",
        refusedTokenAmount: tokenAmount.getCompound(),
        currency: DefaultFiatCurrency,
      },
    });
  const refusedTokenAmount = watch("refusedTokenAmount");
  const reason = watch("reason");

  const handleConfirm = async () => {
    try {
      setIsClosing(true);
      await onClose({ ...getValues() });
      reset();
    } finally {
      setIsClosing(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  useEffect(() => {
    setError("refusedTokenAmount", { type: "manual", message: "" });

    const amount = parseFloat(refusedTokenAmount);
    if (Number.isNaN(amount)) {
      return;
    }

    if (amount <= 0 || amount > Number(tokenAmount.getCompound())) {
      setError("refusedTokenAmount", {
        type: "manual",
        message: `Amount must be between 0 and ${tokenAmount.getCompound()}`,
      });
      return;
    }
  }, [tokenAmount, refusedTokenAmount, setError, setValue]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Confirm Payout Denial</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1">
            Confirm that the withdrawal request won't be executed in total or
            partial. Once confirmed the token holder will get back his{" "}
            {withdrawalRequestInfo.tokenInfo.name} tokens.
          </Typography>
        </DialogContentText>
        <Controller
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label={`${tokenName} Amount`}
              placeholder={`Enter the refused amount of ${tokenName}`}
              aria-autocomplete="none"
              error={error ? error.message : ""}
              hint={`Max  ${tokenAmount.getCompound()} ${tokenName}`}
            />
          )}
          name="refusedTokenAmount"
          control={control}
          rules={{ required: true }}
          // @ts-ignore
          variant="outlined"
        />
        {/*<Box my={2} borderRadius={2} textAlign="center">*/}
        {/*  <Typography variant="caption">Payable Amount</Typography>*/}
        {/*  <Typography variant="h3">*/}
        {/*    {calcFiatAmount()} {getValues("currency")}*/}
        {/*  </Typography>*/}
        {/*</Box>*/}

        <Controller
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label="Reason"
              placeholder="Enter a brief explanation why the payment is refused."
              aria-autocomplete="none"
              error={error ? error.message : ""}
            />
          )}
          name="reason"
          control={control}
          // @ts-ignore
          variant="outlined"
          rules={{
            required: true,
            minLength: 1,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Abort</Button>
        <ActionButton
          actionLabel="Confirm"
          onClick={handleConfirm}
          isLoading={isClosing}
          disabled={!refusedTokenAmount || !reason}
        />
      </DialogActions>
    </Dialog>
  );
};
