import { ActionCard } from "../actionCard";
import { IconFlame } from "@tabler/icons";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { TextInput } from "@/app/components/inputs";

type FormValues = {
  amount: number;
};

export const BurnActionCard = () => {
  // @ts-ignore
  const { control, getValues } = useForm<FormValues>({ amount: 0 });

  const handleOnMintAction = () => {
    console.log("Burnt...");
  };

  return (
    <ActionCard
      title="Suggest Liquidity Burning"
      description="This action allows to lower the liquidity, e.g. when an interest holder sold his shares."
      actionIcon={<IconFlame />}
      actionLabel="Suggest Burning"
      color="warning"
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
