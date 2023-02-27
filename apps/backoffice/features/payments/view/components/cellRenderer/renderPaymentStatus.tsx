import { GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, Tooltip } from "@mui/material";
import { PaymentStatus } from "@/types/paymentStatus";
import { useMemo } from "react";

const StatusColorMap = {
  pending: "error",
  cancelled: "warning",
  processed: "success",
};

interface Props {
  status: PaymentStatus;
}

export const PaymentStatusChip = ({ status }: Props) => {
  const { statusLabel, statusColor } = useMemo(() => {
    if (!status) return { statusLabel: "", statusColor: "" };
    const statusLabel =
      status.substring(0, 1).toUpperCase() + status.substring(1);
    // @ts-ignore
    const statusColor = StatusColorMap[status.toLowerCase()] || "default";
    return {
      statusLabel,
      statusColor,
    };
  }, [status]);

  // @ts-ignore
  return (
    <Tooltip title="Payment Status">
      <Chip label={statusLabel} color={statusColor} />
    </Tooltip>
  );
};

export const renderPaymentStatus = (params: GridRenderCellParams<string>) => {
  const status = params.value as PaymentStatus;
  if (!status) return null;
  return <PaymentStatusChip status={status} />;
};
