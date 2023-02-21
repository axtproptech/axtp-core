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

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Paid At", renderCell: renderCreatedAt },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "amount", headerName: "Paid", flex: 1 },
  { field: "usd", headerName: "USD Value", flex: 1 },
  { field: "poolId", headerName: "Pool Id", flex: 1 }, // as link to pool
  { field: "tokenId", headerName: "Token", flex: 1 }, // as link to explorer and name
  { field: "tokenQuantity", headerName: "Quantity", flex: 1 },
  { field: "transactionId", headerName: "TransactionId", flex: 1 }, // as link to ethscan, evt pix
  { field: "recordId", headerName: "Paid Id", flex: 1 }, // as link to explorer
  { field: "cuid", headerName: "Customer", flex: 1 }, // link to customer, render as name
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

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/payments/${e.id}`);
  };

  return (
    <MainCard title="Pending Payments">
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
