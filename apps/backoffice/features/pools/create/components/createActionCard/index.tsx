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

const FullBox = styled(Box)(() => ({
  width: "100%",
}));

type FormValues = {
  name: string;
  tokenCount: number;
  description: string;
  rate: number;
  nominalLiquidity: number;
  url: string;
};

const required = {
  value: true,
  message: "The field is required",
};

export const CreateActionCard = () => {
  const { execute, isExecuting, transactionId } = useLedgerAction();
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
      name: "AXTP0001",
      description: "Write a description here...",
      rate: 0.0,
      tokenCount: 0,
      url: "",
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
        documentationUrl: formValues.url,
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
                value: /^AXTP\d{4}$/,
                message:
                  "Name must be like AXTP0002 - It's the name of the token",
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
              label="Additional Information URL"
              {...field}
              error={error ? error.message : ""}
            />
          )}
          name="url"
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
