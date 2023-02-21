import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { ChangeEvent, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { Grid, Stack, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { ActivationChip } from "@/app/components/chips/activationChip";
import { BlockingChip } from "@/app/components/chips/blockingChip";
import { TextInput } from "@/app/components/inputs";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconClipboard } from "@tabler/icons";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { Address } from "@signumjs/core";
import { paymentsService } from "@/app/services/paymentService/paymentService";

const renderDate = (params: GridRenderCellParams<string>) => {
  const date = params.value;
  if (!date) return null;
  const formattedDate = new Date(date).toLocaleDateString();
  return <div>{formattedDate}</div>;
};

const renderVerificationLevel = (params: GridRenderCellParams<string>) => {
  const verification = params.value;
  if (!verification) return null;
  return <VerificationChip level={verification} />;
};

const renderActive = (params: GridRenderCellParams<boolean>) => {
  return <ActivationChip isActive={Boolean(params.value)} />;
};

const renderBlocked = (params: GridRenderCellParams<boolean>) => {
  return <BlockingChip isBlocked={Boolean(params.value)} alwaysShow />;
};

const AccountAction = ({ publicKey }: { publicKey: string }) => {
  const { showSuccess } = useSnackbar();
  const accountId = useMemo(() => {
    if (!publicKey) return null;
    try {
      return Address.create(publicKey).getNumericId();
    } catch (e) {
      return null;
    }
  }, [publicKey]);

  if (!accountId) {
    return (
      <Tooltip title={"This account has no blockchain account yet"}>
        <Typography>Missing Key</Typography>
      </Tooltip>
    );
  }

  const handleOnCLick = async (e: React.SyntheticEvent) => {
    try {
      e.stopPropagation();
      await navigator.clipboard.writeText(publicKey);
      showSuccess("Copied Key successfully");
    } catch (err: any) {}
  };

  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title="Copy Accounts Public Key into Clipboard">
        <div>
          <ActionButton
            actionLabel={"Key"}
            actionIcon={<IconClipboard />}
            onClick={handleOnCLick}
          />
        </div>
      </Tooltip>

      <Tooltip title="Open Account in Blockchain Explorer">
        <div>
          <OpenExplorerButton id={accountId} type="address" label="" />
        </div>
      </Tooltip>
    </Stack>
  );
};

const renderAccount = (params: GridRenderCellParams<string>) => (
  <AccountAction publicKey={params.value || ""} />
);

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Paid At", renderCell: renderDate },
  { field: "updatedAt", headerName: "Updated At", renderCell: renderDate },
  { field: "status", headerName: "Situation", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "currency", headerName: "Currency", flex: 1 },
  { field: "amount", headerName: "Paid", flex: 1 },
  { field: "usd", headerName: "USD Value", flex: 1 },
  { field: "poolId", headerName: "Pool Id", flex: 1 }, // as link to pool
  { field: "tokenId", headerName: "Token", flex: 1 }, // as link to explorer and name
  { field: "tokenQuantity", headerName: "Quantity", flex: 1 },
  { field: "transactionId", headerName: "TransactionId", flex: 1 }, // as link to ethscan, evt pix
  { field: "recordId", headerName: "Paid Id", flex: 1 }, // as link to explorer
  { field: "processedRecordId", headerName: "Processed Id", flex: 1 }, // as link to explorer
  { field: "cancelRecordId", headerName: "Cancel Id", flex: 1 }, // as link to explorer
  { field: "cuid", headerName: "Customer", flex: 1 }, // link to customer, render as name
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

  return (
    <MainCard title="Manage Payments">
      <Grid container>
        <Grid item md={4}>
          <TextInput
            label="Search"
            onChange={handleSearch}
            value={searchValue}
          />
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
