import {
  Box,
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
import { SingleWithdrawalRequestInfo } from "../singleWithdrawalRequestInfo";
import { ChainValue } from "@signumjs/util";
import { useSelector } from "react-redux";
import { selectUsdBrlMarketState } from "@/app/states/marketDataState";
import { Config } from "@/app/config";

interface FormArgs {
  paymentReference: string;
  payableTokenAmount: string;
  currency: "BRL" | "USD";
}

export interface ConfirmationArgs extends FormArgs {
  paidFiatAmount: string;
}

interface Props {
  open: boolean;
  onClose: (args: ConfirmationArgs) => Promise<void>;
  onCancel: () => void;
  withdrawalRequestInfo: SingleWithdrawalRequestInfo;
}

const DefaultFiatCurrency = "BRL";

export const ConfirmPayoutDialog = ({
  open,
  onClose,
  onCancel,
  withdrawalRequestInfo,
}: Props) => {
  const mountedRef = useRef<boolean>(false);
  const usdBrlMarket = useSelector(selectUsdBrlMarketState);
  const tokenName = withdrawalRequestInfo.tokenInfo.name;
  const tokenAmount = ChainValue.create(
    withdrawalRequestInfo.tokenInfo.decimals
  ).setAtomic(withdrawalRequestInfo.creditQuantity);

  const [isClosing, setIsClosing] = useState(false);
  const { control, reset, getValues, watch, setValue, setError } =
    useForm<FormArgs>({
      defaultValues: {
        paymentReference: "",
        payableTokenAmount: tokenAmount.getCompound(),
        currency: DefaultFiatCurrency,
      },
    });
  const payableTokenAmount = watch("payableTokenAmount");
  const paymentReference = watch("paymentReference");

  const calcFiatAmount = useCallback(() => {
    let paidFiatAmount = "0";
    const amount = parseFloat(payableTokenAmount);
    if (!Number.isNaN(amount)) {
      paidFiatAmount = (
        (usdBrlMarket.current_price - Config.Platform.Market.PriceAdjustment) *
        amount
      ).toFixed(2);
    }
    return paidFiatAmount;
  }, [payableTokenAmount, usdBrlMarket.current_price]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleConfirm = async () => {
    try {
      setIsClosing(true);
      await onClose({ ...getValues(), paidFiatAmount: calcFiatAmount() });
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
    setError("payableTokenAmount", { type: "manual", message: "" });

    const amount = parseFloat(payableTokenAmount);
    if (Number.isNaN(amount)) {
      return;
    }

    if (amount <= 0 || amount > Number(tokenAmount.getCompound())) {
      setError("payableTokenAmount", {
        type: "manual",
        message: `Amount must be between 0 and ${tokenAmount.getCompound()}`,
      });
      return;
    }
  }, [tokenAmount, payableTokenAmount, setError, setValue]);

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
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label={`${tokenName} Amount`}
              placeholder={`Enter the payable amount of ${tokenName}`}
              aria-autocomplete="none"
              error={error ? error.message : ""}
              hint={`Max  ${tokenAmount.getCompound()} ${tokenName}`}
            />
          )}
          name="payableTokenAmount"
          control={control}
          rules={{ required: true }}
          // @ts-ignore
          variant="outlined"
        />
        <Box my={2} borderRadius={2} textAlign="center">
          <Typography variant="caption">Payable Amount</Typography>
          <Typography variant="h3">
            {calcFiatAmount()} {getValues("currency")}
          </Typography>
        </Box>

        <Controller
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label="Payment Reference"
              placeholder="Enter the payment reference, i.e. identifier of Pix, or other"
              aria-autocomplete="none"
              error={error ? error.message : ""}
            />
          )}
          name="paymentReference"
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
          disabled={!payableTokenAmount || !paymentReference}
        />
      </DialogActions>
    </Dialog>
  );
};
