import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { ChangeEvent, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { Button, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { TextInput } from "@/app/components/inputs";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { renderPaymentStatus } from "@/features/payments/view/components/cellRenderer/renderPaymentStatus";
import { renderCreatedAt } from "@/features/payments/view/components/cellRenderer/renderCreatedAt";
import { renderDate } from "@/features/payments/view/components/cellRenderer/renderDate";
import { renderPaymentType } from "@/features/payments/view/components/cellRenderer/renderPaymentType";
import { renderCurrency } from "@/features/payments/view/components/cellRenderer/renderCurrency";
import { renderAmountUSD } from "@/features/payments/view/components/cellRenderer/renderAmountUSD";
import { renderToken } from "@/features/payments/view/components/cellRenderer/renderToken";
import { renderTransactionId } from "@/features/payments/view/components/cellRenderer/renderTransactionId";
import { renderPaymentRecordId } from "@/features/payments/view/components/cellRenderer/renderPaymentRecordId";
import { renderCustomer } from "@/features/payments/view/components/cellRenderer/renderCustomer";

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Paid At", renderCell: renderCreatedAt },
  { field: "updatedAt", headerName: "Updated At", renderCell: renderDate },
  {
    field: "status",
    headerName: "Situation",
    flex: 1,
    renderCell: renderPaymentStatus,
  },
  { field: "type", headerName: "Type", flex: 1, renderCell: renderPaymentType },
  { flex: 1, field: "amount", headerName: "Paid", renderCell: renderCurrency },
  {
    field: "usd",
    headerName: "USD Value",
    flex: 1,
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

  // { field: "processedRecordId", headerName: "Processed Id", flex: 1 }, // as link to explorer
  // { field: "cancelRecordId", headerName: "Cancel Id", flex: 1 }, // as link to explorer
];

export const PaymentsTable = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const { data, error } = useSWR("getAllPayments", () => {
    return paymentsService.fetchPayments();
  });

  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map(
      ({
        cuid,
        transactionId,
        createdAt,
        updatedAt,
        status,
        type,
        amount,
        poolId,
        tokenId,
        tokenQuantity,
        recordId,
        processedRecordId,
        cancelRecordId,
        currency,
        usd,
      }) => {
        return {
          id: transactionId,
          transactionId,
          cuid,
          updatedAt,
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
          processedRecordId,
          cancelRecordId,
        };
      }
    );
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!searchValue) return tableRows;

    const isLike = (a: string, b: string) => a.toLowerCase().indexOf(b) !== -1;

    return tableRows.filter(({ status, id, type }) => {
      return (
        isLike(status, searchValue) ||
        isLike(id, searchValue) ||
        isLike(type, searchValue)
      );
    });
  }, [tableRows, searchValue]);

  const loading = !data && !error;

  const handleRowClick = async (e: GridRowParams) => {
    console.log(`/admin/payments/${e.id}`);
    // await router.push(`/admin/payments/${e.id}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleShowPending = () => {
    setSearchValue("pending");
  };

  return (
    <MainCard title="Manage Payments">
      <Grid container alignItems="center">
        <Grid item md={4} xs={8}>
          <TextInput
            label="Search"
            onChange={handleSearch}
            value={searchValue}
          />
        </Grid>
        <Grid item sx={{ ml: 2 }}>
          <Button onClick={handleShowPending}>Show Pending</Button>
        </Grid>
      </Grid>
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </MainCard>
  );
};
