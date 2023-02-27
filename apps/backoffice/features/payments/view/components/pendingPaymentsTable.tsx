import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { PaymentStatusChip } from "@/features/payments/view/components/paymentStatusChip";
import { PaymentStatus } from "@/types/paymentStatus";
import { PaymentTypeChip } from "@/features/payments/view/components/paymentTypeChip";
import { PaymentType } from "@axtp/core";
import { Number } from "@/app/components/number";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import Link from "next/link";
import { useAppContext } from "@/app/hooks/useAppContext";
import { shortenHash } from "@/app/shortenHash";
import { openExternalUrl } from "@/app/openExternalUrl";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconLink, IconUser, IconUserCheck } from "@tabler/icons";
import { ExternalLink } from "@/app/components/links/externalLink";

const Days = 1000 * 60 * 60 * 24;

const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const createdAt = params.value;
  if (!createdAt) return null;

  const createdAtDate = new Date(createdAt);
  const overdue = Date.now() - createdAtDate.getTime() > 2 * Days;
  const applied = new Date(createdAt).toLocaleDateString();

  let style = {};
  if (overdue) {
    style = { color: "red", fontWeight: 700 };
  }

  return <div style={style}>{applied}</div>;
};

const renderType = (params: GridRenderCellParams<string>) => {
  const type = params.value as PaymentType;
  if (!type) return null;
  return <PaymentTypeChip type={type} />;
};

const renderCurrency = (params: GridRenderCellParams<string>) => {
  const amount = params.value || "0";
  const currency = params.row.currency;
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

const renderAmount = (params: GridRenderCellParams<string>) => {
  return <Number value={params.value || "0"} suffix="USD" decimals={2} />;
};

const TokenCell = ({ poolId, amount }: { poolId: string; amount: string }) => {
  const contract = usePoolContract(poolId);
  const router = useRouter();
  const handleOnCLick = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!contract) return null;
  return (
    <a
      href={`/admin/pools/${poolId}`}
      style={{
        cursor: "pointer",
        textDecoration: "underline",
        color: "var(--primary-color)",
      }}
      onClick={handleOnCLick}
    >
      <Number
        value={amount}
        decimals={contract.token.decimals}
        suffix={contract.token.name}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
};

const renderToken = (params: GridRenderCellParams<string>) => {
  return params.value ? (
    <TokenCell poolId={params.row.poolId} amount={params.value} />
  ) : null;
};

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

const RecordLink = ({ txId }: { txId: string }) => {
  const { Ledger } = useAppContext();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ExternalLink href={`${Ledger.ExploreBaseUrl}/tx/${txId}`}>
        {shortenHash(txId)}
      </ExternalLink>
    </div>
  );
};
const renderTransactionId = (params: GridRenderCellParams<string>) => {
  return params.value ? (
    <TransactionLink txId={params.value} type={params.row.type} />
  ) : null;
};

const renderRecordId = (params: GridRenderCellParams<string>) => {
  return params.value ? <RecordLink txId={params.value} /> : null;
};

const CustomerLink = ({ cuid }: { cuid: string }) => {
  const router = useRouter();
  const handleOnCLick = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    await router.push(`/admin/customers/${cuid}`);
  };

  return (
    <Button onClick={handleOnCLick}>
      <Tooltip title={"View Customer"}>
        <IconLink />
      </Tooltip>
    </Button>
  );
};
const renderCustomer = (params: GridRenderCellParams<string>) => {
  return params.value ? <CustomerLink cuid={params.value} /> : null;
};

const columns: GridColDef[] = [
  {
    flex: 1,
    field: "createdAt",
    headerName: "Paid At",
    renderCell: renderCreatedAt,
  },
  { flex: 1, field: "type", headerName: "Type", renderCell: renderType },
  { flex: 1, field: "amount", headerName: "Paid", renderCell: renderCurrency },
  { flex: 1, field: "usd", headerName: "USD Value", renderCell: renderAmount },
  {
    flex: 1,
    field: "tokenQuantity",
    headerName: "Quantity",
    renderCell: renderToken,
  },
  {
    flex: 1,
    field: "transactionId",
    headerName: "Transaction Id",
    renderCell: renderTransactionId,
  },
  {
    flex: 1,
    field: "recordId",
    headerName: "Record Id",
    renderCell: renderRecordId,
  }, // as link to explorer
  {
    field: "cuid",
    headerName: "Token Holder",
    renderCell: renderCustomer,
    sortable: false,
  },
];
export const PendingPaymentsTable = () => {
  const router = useRouter();

  const { data, error } = useSWR("getPendingPayments", () => {
    return paymentsService.fetchPendingPayments();
  });

  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map(
      ({
        createdAt,
        type,
        currency,
        amount,
        usd,
        poolId,
        tokenId,
        tokenQuantity,
        transactionId,
        recordId,
        cuid,
      }) => {
        return {
          id: transactionId,
          transactionId,
          cuid,
          createdAt,
          status,
          type,
          amount,
          poolId,
          currency,
          usd,
          tokenId,
          tokenQuantity,
          recordId,
        };
      }
    );
  }, [data]);

  const loading = !data && !error;

  const totalPendingUsd = useMemo(() => {
    return tableRows.reduce((sum, row) => sum + parseFloat(row.usd || "0"), 0);
  }, [tableRows]);
  const handleRowClick = async (e: GridRowParams) => {
    //await router.push(`/admin/payments/${e.id}`);
  };

  return (
    <MainCard
      title={
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}
        >
          <>
            <h3>Pending Payments</h3>
            <h4>
              &nbsp; -{" "}
              <Number value={totalPendingUsd} suffix="USD" decimals={2} />
            </h4>
          </>
        </Box>
      }
    >
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid
            rows={tableRows}
            columns={columns}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </MainCard>
  );
};
