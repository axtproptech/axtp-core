import { ActionCard } from "@/app/components/cards";
import { IconNewSection } from "@tabler/icons";
import { Box, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { styled } from "@mui/material/styles";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";

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
  });
  const [nominalLiquidity, setNominalLiquidity] = useState(0.0);
  const {
    control,
    reset,
    getValues,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: Ledger.IsTestnet ? "TAXTP001" : "AXTP0001",
      description: "Write a description here...",
      rate: 0.0,
      tokenCount: 0,
      alias: "",
    },
  });

  const resetForm = () => {
    reset();
    setNumberValues({ rate: 0, tokenCount: 0 });
  };

  const handleOnCreate = async () => {
    const formValues = getValues();
    await execute((service) =>
      service.poolContract.createPoolInstance({
        name: formValues.name,
        alias: formValues.alias,
        description: formValues.description,
        rate: toStableCoinQuantity(numberValues.rate),
        quantity: numberValues.tokenCount,
      })
    );
    resetForm();
  };

  useEffect(() => {
    if (!transactionId) return;
    reset();
  }, [transactionId]);

  const handleNumberChange =
    (field: "tokenCount" | "rate") => (values: NumberFormatValues) => {
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
