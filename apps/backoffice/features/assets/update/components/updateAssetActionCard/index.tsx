import { ActionCard } from "@/app/components/cards";
import { IconHomeEdit } from "@tabler/icons";
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
import { AssetAliasData } from "@axtp/core";

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
  acquisitionDate: Date;
  revenueStartDate: Date;
};

const required = {
  value: true,
  message: "The field is required",
};

interface Props {
  aliasId: string;
  asset: AssetAliasData;
}
export const UpdateAssetActionCard = ({ asset, aliasId }: Props) => {
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { Ledger } = useAppContext();
  const theme = useTheme();
  const { token } = usePoolContract(asset.poolId);

  const [numberValues, setNumberValues] = useState({
    estimatedMarketValue: asset.estimatedMarketValue,
    accumulatedCosts: asset.accumulatedCosts,
  });

  const {
    control,
    reset,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: asset.name,
      titleId: asset.titleId,
      acquisitionProgress: asset.acquisitionProgress,
      acquisitionStatus: asset.acquisitionStatus,
      estimatedMarketValue: asset.estimatedMarketValue,
      accumulatedCosts: asset.accumulatedCosts,
      acquisitionDate: asset.acquisitionDate,
      revenueStartDate: asset.revenueStartDate,
    },
  });

  const resetForm = () => {
    reset();
    setNumberValues({
      estimatedMarketValue: asset.estimatedMarketValue,
      accumulatedCosts: asset.accumulatedCosts,
    });
  };

  const handleOnUpdate = async () => {
    const formValues = getValues();
    await execute(async (service) => {
      const { transaction: transactionId, fullHash } =
        await service.asset.updateAsset(aliasId, {
          poolId: asset.poolId,
          acquisitionDate: formValues.acquisitionDate,
          revenueStartDate: formValues.revenueStartDate,
          accumulatedCosts: numberValues.accumulatedCosts,
          estimatedMarketValue: numberValues.estimatedMarketValue,
          acquisitionStatus: formValues.acquisitionStatus,
          acquisitionProgress: formValues.acquisitionProgress,
          titleId: formValues.titleId,
          name: formValues.name,
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

  console.log("values", getValues());

  return (
    <ActionCard
      title={`Update Asset to Pool ${token.name.toUpperCase()}`}
      description="Here you can edit/update an asset. The registry is being saved on the blockchain"
      actionIcon={<IconHomeEdit />}
      actionLabel="Update Asset"
      onClick={handleOnUpdate}
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
              required: true,
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
              required: true,
            }}
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            name="acquisitionDate"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Acquisition Date"
                  // @ts-ignore
                  control={control}
                  inputFormat="dd.MM.yyyy"
                  value={value}
                  // @ts-ignore
                  onChange={(d) => setValue("acquisitionDate", d)}
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
            name="revenueStartDate"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Revenue Start Date"
                  // @ts-ignore
                  control={control}
                  inputFormat="dd.MM.yyyy"
                  value={value}
                  // @ts-ignore
                  onChange={(d) => setValue("revenueStartDate", d)}
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
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
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
            rules={{ required: true }}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
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
            rules={{ required: true }}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
      </Stack>
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
