import { ActionCard } from "@/app/components/cards";
import { IconNewSection } from "@tabler/icons";
import { Box, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { SelectInput, SelectOption, TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { styled } from "@mui/material/styles";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { ChainValue } from "@signumjs/util";

export const PublicOptions: SelectOption[] = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const FullBox = styled(Box)(() => ({
  width: "100%",
}));

type FormValues = {
  name: string;
  tokenCount: number;
  description: string;
  rate: number;
  nominalLiquidity: number;
  alias: string;
  isPublic: 0 | 1;
  goal: number;
};

const required = {
  value: true,
  message: "The field is required",
};

export const CreateActionCard = () => {
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const { Ledger } = useAppContext();
  const { token } = useMasterContract();
  const [numberValues, setNumberValues] = useState({
    rate: 0.0,
    tokenCount: 0,
    goal: 0.0,
  });
  const [nominalLiquidity, setNominalLiquidity] = useState(0.0);
  const {
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: Ledger.IsTestnet ? "TAXTP001" : "AXTP0001",
      description: "Write a description here...",
      rate: 0.0,
      tokenCount: 0,
      isPublic: 0,
      goal: 0,
      alias: "",
    },
  });

  const name = watch("name");
  const isPublic = watch("isPublic");

  useEffect(() => {
    if (!getValues("alias")) {
      setValue("alias", name.toLowerCase());
    }
  }, [name]);

  const resetForm = () => {
    reset();
    setNumberValues({ rate: 0, tokenCount: 0, goal: 0 });
  };

  const handleOnCreate = async () => {
    const formValues = getValues();
    await execute((service) =>
      service.poolContract.createPoolInstance({
        isPublic: formValues.isPublic,
        alias: formValues.alias,
        description: formValues.description,
        name: formValues.name,
        goal: Number(
          ChainValue.create(token.decimals)
            .setCompound(numberValues.goal)
            .getAtomic()
        ),
        quantity: numberValues.tokenCount, // decimal is always 1
        rate: Number(
          ChainValue.create(token.decimals)
            .setCompound(numberValues.rate)
            .getAtomic()
        ),
      })
    );
    resetForm();
  };

  useEffect(() => {
    if (!transactionId) return;
    reset();
  }, [transactionId]);

  const handleNumberChange =
    (field: "tokenCount" | "rate" | "goal") => (values: NumberFormatValues) => {
      setNumberValues({ ...numberValues, [field]: values.floatValue });
    };

  useEffect(() => {
    setNominalLiquidity(numberValues.tokenCount * numberValues.rate);
  }, [numberValues]);

  return (
    <ActionCard
      title="Create Pool"
      description="Here you can create an asset pool"
      actionIcon={<IconNewSection />}
      actionLabel="Create Pool"
      onClick={handleOnCreate}
      isLoading={isExecuting}
      disabled={!isValid}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field, fieldState: { error } }) => (
              <TextInput
                label="Pool Token Symbol"
                {...field}
                error={error ? error.message : ""}
              />
            )}
            name="name"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              pattern: {
                value: Ledger.IsTestnet ? /^TAXTP\d{3}$/ : /^AXTP\d{4}$/,
                message: Ledger.IsTestnet
                  ? "Name must be like TAXTP002 - It's the name of the token"
                  : "Name must be like AXTP0002 - It's the name of the token",
              },
              required,
            }}
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Amount of Shares"
                color="primary"
                decimalScale={0}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("tokenCount")}
              />
            )}
            name="tokenCount"
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
            render={({ field }) => (
              <NumericFormat
                label={`Price per Share in ${token.name}`}
                color="primary"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("rate")}
              />
            )}
            name="rate"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required,
            }}
          />
        </FullBox>
        <FullBox>
          <NumericFormat
            label={`Nominal Liquidity in ${token.name}`}
            color="primary"
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator
            customInput={TextInput}
            value={nominalLiquidity}
            disabled
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Goal"
                color="primary"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("goal")}
                disabled={!isPublic}
                allowNegative={false}
                max={nominalLiquidity}
              />
            )}
            name="goal"
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
              // @ts-ignore
              <SelectInput
                label="Visibility"
                options={PublicOptions}
                {...field}
              />
            )}
            name="isPublic"
            control={control}
            rules={{ required: true }}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
      </Stack>
      <FullBox>
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              label="Description"
              // @ts-ignore
              multiline
              maxRows={6}
            />
          )}
          name="description"
          control={control}
          // @ts-ignore
          variant="outlined"
          rules={{
            maxLength: 512,
          }}
        />
      </FullBox>
      <FullBox>
        <Controller
          render={({ field, fieldState: { error } }) => (
            <TextInput
              label="Alias Name"
              {...field}
              error={error ? error.message : ""}
              hint="An Alias is a blockchain entity that allows us to maintain mutable data. There we can add and update further pool information, i.e. urls to docs and more."
            />
          )}
          name="alias"
          control={control}
          // @ts-ignore
          variant="outlined"
          rules={{
            maxLength: 384,
          }}
        />
      </FullBox>
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
