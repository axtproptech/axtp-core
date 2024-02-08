import { MainCard } from "@/app/components/cards";
import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Address } from "@signumjs/core";
import { ExternalLink } from "@/app/components/links/externalLink";
import { Button, Stack, Typography } from "@mui/material";
import { IconLink, IconUserOff } from "@tabler/icons";
import { CreditorsActions } from "./creditorsActions";
import {
  RegisterCreditorDialog,
  RegistrationArgs,
} from "./registerCreditorDialog";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { ActionButton } from "@/app/components/buttons/actionButton";

const AddressCell = (params: GridRenderCellParams<string>) => {
  const explorerLink = params.row.explorerLink;
  if (!explorerLink) return null;

  return (
    <ExternalLink href={explorerLink}>
      <Button>
        <IconLink />
        {params.row.address}
      </Button>
    </ExternalLink>
  );
};
const ActionsCell = (params: GridRenderCellParams<string>) => {
  const accountId = params.id;
  const { execute, isExecuting } = useLedgerAction();
  if (!accountId) return null;

  const unregisterCreditor = () => {
    execute((ledgerService) =>
      ledgerService.burnContract.removeCreditor(accountId.toString())
    );
  };

  return (
    <Stack direction="row" alignItems="center">
      <ActionButton
        actionLabel="Unregister"
        onClick={unregisterCreditor}
        color="warning"
        actionIcon={<IconUserOff />}
        isLoading={isExecuting}
      />
    </Stack>
  );
};

const columns: GridColDef[] = [
  {
    field: "accountAddress",
    headerName: "Address",
    renderCell: AddressCell,
    flex: 1,
  },
  {
    field: "tokenName",
    headerName: "Token",
    flex: 1,
  },
  {
    field: "quantity",
    headerName: "Amount",
    flex: 1,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 160,
    align: "center",
    renderCell: ActionsCell,
  },
];

interface WithdrawalRequestsGridRow {
  id: string;
  accountId: string;
  accountAddress: string;
  tokenName: string;
  tokenId: string;
  quantity: string;
}

export const WithdrawalRequestsTable = () => {
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
          id: `{tokenInfo.tokenId}.{accountId}`,
          accountId,
          tokenId: tokenInfo.id,
          accountAddress: Address.fromNumericId(
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

  return (
    <>
      <MainCard title={<Title />}>
        <Typography variant="caption"></Typography>
        <div style={{ height: "50vh" }}>
          <div style={{ height: "100%" }}>
            <DataGrid rows={tableRows} columns={columns} loading={isLoading} />
          </div>
        </div>
        <SucceededTransactionSection transactionId={transactionId} />
      </MainCard>

      {/*<RegisterCreditorDialog*/}
      {/*  open={modalOpened}*/}
      {/*  onClose={confirmRegisterCreditor}*/}
      {/*  onCancel={() => setModalOpened(false)}*/}
      {/*/>*/}
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
