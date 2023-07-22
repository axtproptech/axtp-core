import { ActionCard } from "@/app/components/cards";
import { IconHomePlus } from "@tabler/icons";
import { Box, Stack, TextField, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { SelectInput, TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { styled } from "@mui/material/styles";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import {
  AcquisitionProgressOptions,
  AcquisitionStatusOptions,
} from "@/features/pools/create/components/assetOptions";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const FullBox = styled(Box)(() => ({
  width: "100%",
}));

type FormValues = {
  name: string;
  titleId: string;
  acquisitionProgress: number;
  acquisitionStatus: number;
  estimatedMarketValue: number;
  accumulatedCosts: number;
  acquisitionDate: number; // millies
};

const required = {
  value: true,
  message: "The field is required",
};

interface Props {
  poolId: string;
}
export const CreateAssetActionCard = ({ poolId }: Props) => {
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { Ledger } = useAppContext();
  const theme = useTheme();

  console.log("pool", poolId);

  const { token } = usePoolContract(poolId);
  const [numberValues, setNumberValues] = useState({
    estimatedMarketValue: 0.0,
    accumulatedCosts: 0.0,
  });
  const {
    control,
    reset,
    getValues,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      titleId: "",
      acquisitionProgress: 0,
      acquisitionStatus: 0,
      estimatedMarketValue: 0.0,
      accumulatedCosts: 0.0,
      acquisitionDate: Date.now(),
    },
  });

  const resetForm = () => {
    reset();
    setNumberValues({ rate: 0, tokenCount: 0 });
  };

  const handleOnCreate = async () => {
    const formValues = getValues();
    await execute(async (service) => {
      const { transaction: transactionId, fullHash } =
        await service.asset.createAssetOnPool(poolId, {
          ...formValues,
        });
      return {
        transactionId,
        fullHash,
      };
    });
    resetForm();
  };

  useEffect(() => {
    if (!transactionId) return;
    reset();
  }, [reset, transactionId]);

  const handleNumberChange =
    (field: "accumulatedCosts" | "estimatedMarketValue") =>
    (values: NumberFormatValues) => {
      setNumberValues({ ...numberValues, [field]: values.floatValue });
    };

  // @ts-ignore
  // @ts-ignore
  return (
    <ActionCard
      title={`Add Asset to Pool ${token.name.toUpperCase()}`}
      description="Here you can create a new asset registry and add it to the pool. The registry is being saved on the blockchain"
      actionIcon={<IconHomePlus />}
      actionLabel="Add Asset"
      onClick={handleOnCreate}
      isLoading={isExecuting}
      disabled={!isValid}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field, fieldState: { error } }) => (
              <TextInput
                label="Asset Name"
                {...field}
                error={error ? error.message : ""}
              />
            )}
            name="name"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              maxLength: 48,
              required: true,
            }}
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field, fieldState: { error } }) => (
              <TextInput
                label="Title Identifier"
                {...field}
                error={error ? error.message : ""}
              />
            )}
            name="titleId"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{ required: true }}
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Acquisition Costs"
                color="primary"
                suffix=" USD"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("accumulatedCosts")}
              />
            )}
            name="accumulatedCosts"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required,
            }}
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Estimated Market Value"
                color="primary"
                suffix=" USD"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("estimatedMarketValue")}
              />
            )}
            name="estimatedMarketValue"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required,
            }}
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            name="acquisitionDate"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Acquisition Date"
                  control={control}
                  inputFormat="dd-MM-yyyy"
                  value={value}
                  // onChange={(event) => { onChange(event); }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      error={!!error}
                      helperText={error?.message}
                      // @ts-ignore
                      sx={{ ...theme.typography.customInput, width: "100%" }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              // @ts-ignore
              <SelectInput
                label="Acquisition Progress"
                options={AcquisitionProgressOptions}
                {...field}
              />
            )}
            name="acquisitionProgress"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field }) => (
              // @ts-ignore
              <SelectInput
                label="Acquisition Status"
                options={AcquisitionStatusOptions}
                {...field}
              />
            )}
            name="acquisitionStatus"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
      </Stack>
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
