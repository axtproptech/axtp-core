import { MainCard } from "@/app/components/cards";
import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Address } from "@signumjs/core";
import { ExternalLink } from "@/app/components/links/externalLink";
import { Button, Typography } from "@mui/material";
import { IconLink } from "@tabler/icons";
import { CreditorsActions } from "./creditorsActions";
import {
  RegisterCreditorDialog,
  RegistrationArgs,
} from "./registerCreditorDialog";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";

const renderAddress = (params: GridRenderCellParams<string>) => {
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

const columns: GridColDef[] = [
  {
    field: "address",
    headerName: "Address",
    renderCell: renderAddress,
    flex: 1,
  },
];

export const CreditorsTable = () => {
  const {
    Ledger: { ExploreBaseUrl, Prefix },
  } = useAppContext();
  const { isLoading, creditorAccountIds } = useBurnContract();
  const { transactionId, execute, isExecuting } = useLedgerAction();
  const [modalOpened, setModalOpened] = useState(false);

  const tableRows = useMemo(() => {
    if (!creditorAccountIds) return [];
    return creditorAccountIds.map((id) => {
      return {
        id,
        address: Address.fromNumericId(id, Prefix).getReedSolomonAddress(),
        explorerLink: `${ExploreBaseUrl}/address/${id}`,
      };
    });
  }, [ExploreBaseUrl, Prefix, creditorAccountIds]);

  useEffect(() => {
    if (!!transactionId) {
      setModalOpened(false);
    }
  }, [transactionId]);
  const handleCreditorsActions = (action: "register") => {
    setModalOpened(action === "register");
    return Promise.resolve();
  };
  const confirmRegisterCreditor = async ({
    creditorAccountId,
  }: RegistrationArgs) => {
    return execute((ledgerService) =>
      ledgerService.burnContract.addCreditor(creditorAccountId)
    );
  };

  return (
    <>
      <MainCard
        title={<Title />}
        actions={
          <CreditorsActions
            isExecuting={isExecuting}
            onAction={handleCreditorsActions}
          />
        }
        actionsOnTop
      >
        <Typography variant="caption"></Typography>
        <div style={{ height: "50vh" }}>
          <div style={{ height: "100%" }}>
            <DataGrid rows={tableRows} columns={columns} loading={isLoading} />
          </div>
        </div>
        <SucceededTransactionSection transactionId={transactionId} />
      </MainCard>

      <RegisterCreditorDialog
        open={modalOpened}
        onClose={confirmRegisterCreditor}
        onCancel={() => setModalOpened(false)}
      />
    </>
  );
};

const Title = () => (
  <>
    <Typography variant="h3">Creditors</Typography>
    <Typography variant="caption">
      Creditors are accounts who are permitted to register payouts for requested
      withdrawals.
    </Typography>
  </>
);
