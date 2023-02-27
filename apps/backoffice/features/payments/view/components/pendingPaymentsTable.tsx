import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { useMemo } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { Number } from "@/app/components/number";
import { Box } from "@mui/material";
import { renderCustomer } from "./cellRenderer/renderCustomer";
import { renderCreatedAt } from "./cellRenderer/renderCreatedAt";
import { renderCurrency } from "./cellRenderer/renderCurrency";
import { renderPaymentType } from "./cellRenderer/renderPaymentType";
import { renderAmountUSD } from "./cellRenderer/renderAmountUSD";
import { renderToken } from "./cellRenderer/renderToken";
import { renderTransactionId } from "./cellRenderer/renderTransactionId";
import { renderPaymentRecordId } from "./cellRenderer/renderPaymentRecordId";

const columns: GridColDef[] = [
  {
    flex: 1,
    field: "createdAt",
    headerName: "Paid At",
    renderCell: renderCreatedAt,
  },
  { flex: 1, field: "type", headerName: "Type", renderCell: renderPaymentType },
  { flex: 1, field: "amount", headerName: "Paid", renderCell: renderCurrency },
  {
    flex: 1,
    field: "usd",
    headerName: "USD Value",
    renderCell: renderAmountUSD,
  },
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
    renderCell: renderPaymentRecordId,
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
