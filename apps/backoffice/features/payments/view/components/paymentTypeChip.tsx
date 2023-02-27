import { Chip, Tooltip } from "@mui/material";
import { PaymentType } from "@axtp/core";

const StatusTypeLabelMap = {
  pix: "PIX",
  usdeth: "Ethereum",
  usdsol: "Solana",
  usdalg: "Algorand",
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
