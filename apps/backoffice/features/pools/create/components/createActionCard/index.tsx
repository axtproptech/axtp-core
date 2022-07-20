import { ActionCard } from "@/app/components/cards";
import { IconFlame, IconNewSection } from "@tabler/icons";
import { Box, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { styled, useTheme } from "@mui/material/styles";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { useEffect, useState } from "react";
import { Config } from "@/app/config";

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
  const theme = useTheme();
  const { token } = useMasterContract();
  const [numberValues, setNumberValues] = useState({
    rate: 0.0,
    tokenCount: 0,
  });
  const [nominalLiquidity, setNominalLiquidity] = useState(0.0);
  const { control, reset } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "PST0001",
      description: "Write a description here...",
      rate: 0.0,
      tokenCount: 0,
      url: "",
    },
  });

  // const [error, setError] = useState("");
  // const [floatAmount, setFloatAmount] = useState(0.0);
  // const { execute, isExecuting, transactionId } = useLedgerAction();
  // const { token } = useMasterContract();

  // const handleOnBurnAction = () => {
  //   const amountQuantity = toStableCoinQuantity(floatAmount.toString(10));
  //   execute((service) => service.masterContract.requestBurn(amountQuantity));
  // };
  //
  // useEffect(() => {
  //   if (!transactionId) return;
  //   if (error && transactionId) {
  //     setError("");
  //   }
  //   reset();
  // }, [transactionId]);
  //
  // const handleValueChange = (values: NumberFormatValues) => {
  //   const MinimumValue = 0.1;
  //   if (values.floatValue !== undefined && values.floatValue <= MinimumValue) {
  //     return setError(`Value must be greater than ${MinimumValue}`);
  //   }
  //   if (values.floatValue !== undefined) {
  //     setFloatAmount(values.floatValue);
  //   }
  //   setError("");
  // };

  const resetForm = () => {
    reset();
    setNumberValues({ rate: 0, tokenCount: 0 });
  };

  const handleOnCreate = () => {
    console.log("Created");
    resetForm();
  };

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
      // isLoading={isExecuting}
      // disabled={!!error}
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
                value: /^PST\d{4}$/,
                message:
                  "Name must be like PST0002 - It's the name of the token",
              },
              required,
            }}
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumberFormat
                label="Amount of Shares"
                color="primary"
                decimalScale={0}
                allowEmptyFormatting={false}
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
              <NumberFormat
                label={`Price per Share in ${token.name}`}
                color="primary"
                decimalScale={2}
                allowEmptyFormatting={false}
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
          <NumberFormat
            label={`Nominal Liquidity in ${token.name}`}
            color="primary"
            decimalScale={2}
            allowEmptyFormatting={false}
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
            maxLength: 384,
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
        />
      </FullBox>
      {/*{error && (*/}
      {/*  <Typography color={theme.palette.error.main}>{error}</Typography>*/}
      {/*)}*/}
      {/*<SucceededTransactionSection transactionId={transactionId} />*/}
    </ActionCard>
  );
};
