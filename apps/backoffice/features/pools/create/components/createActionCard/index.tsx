import { ActionCard } from "@/app/components/cards";
import { IconFlame, IconNewSection } from "@tabler/icons";
import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { TextInput } from "@/app/components/inputs";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { toStableCoinQuantity } from "@/app/tokenQuantity";
import { styled, useTheme } from "@mui/material/styles";
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

export const CreateActionCard = () => {
  const theme = useTheme();
  const {
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "PST0001",
      description: "Write a description here...",
      rate: 3000,
      nominalLiquidity: 0,
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

  const handleOnCreate = () => {
    console.log("Created");
    reset();
  };

  console.log("errors", errors.name);

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
              message: "Name must be like PST0002 - It's the name of the token",
            },
          }}
        />
      </FullBox>
      <FullBox>
        <Controller
          render={({ field }) => <TextInput label="Description" {...field} />}
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
          render={({ field }) => (
            <NumberFormat
              label={`Share Token Amount`}
              color="primary"
              decimalScale={0}
              allowEmptyFormatting={false}
              // @ts-ignore
              control={control}
              {...field}
              customInput={TextInput}
            />
          )}
          name="tokenCount"
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
