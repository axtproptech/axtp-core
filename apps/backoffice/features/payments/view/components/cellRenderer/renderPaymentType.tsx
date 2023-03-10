import { GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, Tooltip } from "@mui/material";
import { PaymentType } from "@axtp/core";

const StatusTypeLabelMap = {
  pix: "PIX",
  usdeth: "Ethereum",
  usdsol: "Solana",
  usdalg: "Algorand",
  usdmat: "Polygon",
};

interface Props {
  type: PaymentType;
}

export const PaymentTypeChip = ({ type }: Props) => {
  return (
    <Tooltip title="Payment Type">
      <Chip label={StatusTypeLabelMap[type] || ""} color="info" />
    </Tooltip>
  );
};

export const renderPaymentType = (params: GridRenderCellParams<string>) => {
  const type = params.value as PaymentType;
  if (!type) return null;
  return <PaymentTypeChip type={type} />;
};
