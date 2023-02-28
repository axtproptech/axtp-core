import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { ChangeEvent, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
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
import { renderCustomer } from "@/features/payments/view/components/cellRenderer/renderCustomer";
import { Number } from "@/app/components/number";

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
    field: "cuid",
    headerName: "Token Holder",
    renderCell: renderCustomer,
    sortable: false,
  },
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

    const term = searchValue.toLowerCase();
    const isLike = (a: string, b: string) => a.toLowerCase().indexOf(b) !== -1;

    return tableRows.filter(({ status, id, type }) => {
      return isLike(status, term) || isLike(id, term) || isLike(type, term);
    });
  }, [tableRows, searchValue]);

  const loading = !data && !error;

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/payments/${e.id}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFilterStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value === "all" ? "" : e.target.value);
  };

  const title = useMemo(() => {
    const totalProcessed = tableRows
      .filter((r) => r.status === "Processed")
      .reduce((sum, r) => sum + parseFloat(r.usd), 0);
    const filtered = filteredRows.reduce(
      (sum, r) => sum + parseFloat(r.usd),
      0
    );
    return (
      <>
        <Typography variant="h3">
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <div>Manage Payments - Paid:&nbsp;</div>
            <Number value={totalProcessed} suffix="USD" decimals={2} />
          </Box>
        </Typography>
        <Typography variant="caption" color="secondary">
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <div>Showing: </div>
            <Number value={filtered} suffix="USD" decimals={2} />
          </Box>
        </Typography>
      </>
    );
  }, [filteredRows, tableRows]);

  return (
    <MainCard title={title}>
      <Grid container alignItems="center">
        <Grid item md={4} xs={8}>
          <TextInput
            label="Search"
            onChange={handleSearch}
            value={searchValue}
          />
        </Grid>
        <Grid item sx={{ ml: 2 }}>
          <FormControl>
            <FormLabel id="payment-status-label">Status</FormLabel>
            <RadioGroup
              row
              aria-labelledby="payment-status-label"
              name="payment-status-group"
              onChange={handleFilterStatusChange}
            >
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel
                value="Pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="Processed"
                control={<Radio />}
                label="Processed"
              />
              <FormControlLabel
                value="Cancelled"
                control={<Radio />}
                label="Cancelled"
              />
            </RadioGroup>
          </FormControl>
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
