import { GridRenderCellParams } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { Number } from "@/app/components/number";

export const renderCurrency = (params: GridRenderCellParams<string>) => {
  const amount = params.value || "0";
  const currency = params.row.currency.toUpperCase();
  const usd = params.row.usd;
  const usdf = parseFloat(usd || "0");
  const rate = usdf > 0 ? parseFloat(amount) / usdf : "0";
  return (
    <Stack>
      <Number value={amount} suffix={currency} decimals={2} />
      <small>
        1 USD : <Number value={rate} suffix={currency} decimals={2} />
      </small>
    </Stack>
  );
};
