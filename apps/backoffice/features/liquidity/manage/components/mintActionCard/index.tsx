import { ActionCard } from "../../../components/actionCard";
import { IconSeeding } from "@tabler/icons";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import NumberFormat from "react-number-format";
import { TextInput } from "@/app/components/inputs";

type FormValues = {
  amount: number;
};

export const MintActionCard = () => {
  // @ts-ignore
  const { control, getValues } = useForm<FormValues>({ amount: 0 });

  const handleOnMintAction = () => {
    console.log("Minted...", getValues());
  };

  return (
    <ActionCard
      title="Suggest Liquidity Minting"
      description="This action allows to raise the liquidity, e.g. when an interest holder bought some shares, or on other distributable earning."
      actionLabel="Suggest Minting"
      color="success"
      actionIcon={<IconSeeding />}
      onClick={handleOnMintAction}
    >
      <Box sx={{ width: "100%" }}>
        <Controller
          render={({ field }) => (
            <NumberFormat
              label="Amount"
              color="primary"
              decimalScale={2}
              allowEmptyFormatting={false}
              // @ts-ignore
              control={control}
              prefix={"STC "}
              fixedDecimalScale={true}
              thousandSeparator={true}
              {...field}
              customInput={TextInput}
            />
          )}
          name="amount"
          control={control}
          // @ts-ignore
          variant="outlined"
        />
      </Box>
    </ActionCard>
  );
};
