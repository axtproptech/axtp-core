import { PaymentType } from "@axtp/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { openExternalUrl } from "@/app/openExternalUrl";
import { Chip, Tooltip } from "@mui/material";
import { shortenHash } from "@/app/shortenHash";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { PaymentTypesLabelMap } from "@/features/payments/paymentTypesLabelMap";

const TransactionLink = ({
  txId,
  type,
}: {
  txId: string;
  type: PaymentType;
}) => {
  const { Ledger } = useAppContext();
  const { showError, showSuccess } = useSnackbar();

  let url = "";
  if (type === "usdeth") {
    url =
      (Ledger.IsTestnet
        ? `https://goerli.etherscan.io/tx/`
        : `https://etherscan.io/tx/`) + txId;
  }

  const handleOnCLick = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (url) {
      openExternalUrl(url);
    } else {
      try {
        await navigator.clipboard.writeText(txId);
        showSuccess("Copied Transaction Id to Clipboard");
      } catch (e) {
        showError("Copying Transaction Id failed");
      }
    }
  };

  return (
    <div
      style={{
        cursor: "pointer",
        textDecoration: "underline",
        color: "var(--primary-color)",
      }}
      onClick={handleOnCLick}
    >
      <Tooltip title="Click to copy or follow link">
        <span>{shortenHash(txId)}</span>
      </Tooltip>
    </div>
  );
};
export const renderTransactionId = (params: GridRenderCellParams<string>) => {
  return params.value ? (
    <TransactionLink txId={params.value} type={params.row.type} />
  ) : (
    <Chip label="Not Registered" color="error" />
  );
};
