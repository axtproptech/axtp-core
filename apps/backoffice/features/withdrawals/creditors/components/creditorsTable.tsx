import { MainCard } from "@/app/components/cards";
import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Address } from "@signumjs/core";
import { Button, Stack, Typography } from "@mui/material";
import { IconLink, IconUserOff } from "@tabler/icons";
import {
  RegisterCreditorDialog,
  RegistrationArgs,
} from "./registerCreditorDialog";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { CreditorsTableHeader } from "./creditorsTableHeader";
import { AddressCell } from "../../components/addressCell";

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
    field: "address",
    headerName: "Address",
    renderCell: AddressCell,
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

export const CreditorsTable = () => {
  const {
    Ledger: { ExploreBaseUrl, Prefix },
  } = useAppContext();
  const { isLoading, creditorAccountIds } = useBurnContract();
  const [modalOpened, setModalOpened] = useState(false);
  const { transactionId, execute, isExecuting } = useLedgerAction();

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

  const handleCreditorsActions = (action: "register") => {
    setModalOpened(action === "register");
  };
  const confirmRegisterCreditor = async ({
    creditorAccountId,
  }: RegistrationArgs) => {
    return execute((ledgerService) =>
      ledgerService.burnContract.addCreditor(creditorAccountId)
    );
  };

  useEffect(() => {
    if (!!transactionId) {
      setModalOpened(false);
    }
  }, [transactionId]);

  return (
    <>
      <MainCard
        title={
          <CreditorsTableHeader
            transactionId={transactionId}
            onAction={handleCreditorsActions}
            isExecuting={isExecuting}
          />
        }
      >
        <Typography variant="caption"></Typography>
        <div style={{ height: "50vh" }}>
          <div style={{ height: "100%" }}>
            <DataGrid rows={tableRows} columns={columns} loading={isLoading} />
          </div>
        </div>
      </MainCard>

      <RegisterCreditorDialog
        open={modalOpened}
        onClose={confirmRegisterCreditor}
        onCancel={() => setModalOpened(false)}
      />
    </>
  );
};
