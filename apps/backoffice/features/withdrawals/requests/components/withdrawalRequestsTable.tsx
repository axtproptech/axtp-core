import { MainCard } from "@/app/components/cards";
import { useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Address } from "@signumjs/core";
import { Typography } from "@mui/material";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { AddressCell } from "../../components/addressCell";
import { useRouter } from "next/router";

const columns: GridColDef[] = [
  {
    field: "address",
    headerName: "Address",
    renderCell: AddressCell,
    flex: 1,
  },
  {
    field: "tokenName",
    headerName: "Currency",
    flex: 1,
  },
  {
    field: "quantity",
    headerName: "Amount",
    flex: 1,
  },
];

interface WithdrawalRequestsGridRow {
  id: string;
  accountId: string;
  address: string;
  explorerLink: string;
  tokenName: string;
  tokenId: string;
  quantity: string;
}

export const WithdrawalRequestsTable = () => {
  const router = useRouter();
  const {
    Ledger: { ExploreBaseUrl, Prefix },
  } = useAppContext();
  const { isLoading, tokenAccountCredits } = useBurnContract();
  const { transactionId, execute, isExecuting } = useLedgerAction();
  const [modalOpened, setModalOpened] = useState(false);

  const tableRows = useMemo(() => {
    const rows: WithdrawalRequestsGridRow[] = [];

    for (let { tokenInfo, accountCredits } of tokenAccountCredits) {
      for (let { accountId, creditQuantity } of accountCredits) {
        rows.push({
          id: `${tokenInfo.id}.${accountId}`,
          accountId,
          tokenId: tokenInfo.id,
          explorerLink: `${ExploreBaseUrl}/address/${accountId}`,
          address: Address.fromNumericId(
            accountId,
            Prefix
          ).getReedSolomonAddress(),
          tokenName: tokenInfo.name,
          quantity: creditQuantity,
        });
      }
    }

    return rows;
  }, [Prefix, tokenAccountCredits]);

  const handleRowClick = async (e: GridRowParams) => {
    const tokenId = e.row.tokenId;
    const accountId = e.row.accountId;
    await router.push(`/admin/withdrawals/requests/${tokenId}/${accountId}`);
  };

  return (
    <>
      <MainCard title={<Title />}>
        <Typography variant="caption"></Typography>
        <div style={{ height: "50vh" }}>
          <div style={{ height: "100%" }}>
            <DataGrid
              rows={tableRows}
              columns={columns}
              loading={isLoading}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </MainCard>
    </>
  );
};

const Title = () => (
  <>
    <Typography variant="h3">Withdrawal Requests</Typography>
    <Typography variant="caption">
      Here you can see all token holders who request withdrawal of their stable
      coin balances.
    </Typography>
  </>
);
