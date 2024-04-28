import { GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, Tooltip } from "@mui/material";
import { PaymentType } from "@axtp/core/paymentRecord";
import { PaymentTypesLabelMap } from "@/features/payments/paymentTypesLabelMap";

interface Props {
  type: PaymentType;
}

export const PaymentTypeChip = ({ type }: Props) => {
  return (
    <Tooltip title="Payment Type">
      <Chip label={PaymentTypesLabelMap[type] || ""} color="info" />
    </Tooltip>
  );
};

export const renderPaymentType = (params: GridRenderCellParams<string>) => {
  const type = params.value as PaymentType;
  if (!type) return null;
  return <PaymentTypeChip type={type} />;
};
