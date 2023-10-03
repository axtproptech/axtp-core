import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridAlignment,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { Stack, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconClipboard } from "@tabler/icons";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { Address } from "@signumjs/core";
import { toDateStr } from "@/app/toDateStr";
import { CustomerSearchFilters } from "./customerSearchFilters";
import { Pagination, PaginationProps } from "./pagination";
import { set } from "nprogress";

const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const Days = 1000 * 60 * 60 * 24;
  const createdAt = params.value;
  if (!createdAt) return null;

  const createdAtDate = new Date(createdAt);
  const overdue = Date.now() - createdAtDate.getTime() > 10 * Days;
  const applied = toDateStr(new Date(createdAt));

  let style = {};
  if (overdue) {
    style = { color: "red", fontWeight: 700 };
  }

  return <div style={style}>{applied}</div>;
};

const renderVerificationLevel = (params: GridRenderCellParams<string>) => {
  const verification = params.value;
  if (!verification) return null;
  return <VerificationChip level={verification} />;
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
      <Tooltip
        title={
          "This account has no blockchain account yet, or wallet is not connected"
        }
      >
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

const FlagCellProps = {
  flex: 0,
  resizable: false,
  width: 80,
  align: "center" as GridAlignment,
};

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Applied On", renderCell: renderCreatedAt },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "cpfCnpj", headerName: "CPF", flex: 1 },
  { field: "email1", headerName: "E-Mail", flex: 1 },
  { field: "phone1", headerName: "Phone", flex: 1 },
  {
    field: "verificationLevel",
    headerName: "Verification",
    flex: 1,
    renderCell: renderVerificationLevel,
  },
  {
    field: "blockchainAccount",
    headerName: "Public Key",
    flex: 1,
    sortable: false,
    renderCell: renderAccount,
  },
  {
    field: "isActive",
    headerName: "Active",
    ...FlagCellProps,
  },
  {
    field: "isBlocked",
    headerName: "Blocked",
    ...FlagCellProps,
  },
  {
    field: "isInvited",
    headerName: "Invited",
    ...FlagCellProps,
  },
  {
    field: "isInBrazil",
    headerName: "Brazilian",
    ...FlagCellProps,
  },
];

const asFlag = (b: Boolean) => (b ? "✅" : "❌");

export const CustomerTable = () => {
  const router = useRouter();
  const query = router.query;
  const pathname = router.pathname;

  const [searchValue, setSearchValue] = useState("");
  const [name, setName] = useState((query!.name as string) || "");
  const [email, setEmail] = useState((query!.email as string) || "");
  const [cpf, setCPF] = useState((query!.cpf as string) || "");
  const [isVerified, setIsVerified] = useState(query.verified === "true");
  const [isBlocked, setIsBlocked] = useState(query.blocked === "true");
  const [isActive, setIsActive] = useState(query.active === "true");
  const [isInvited, setIsInvited] = useState(query.invited === "true");
  const [isInBrazil, setIsInBrazil] = useState(query.brazilian === "true");
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 5,
  });

  const [showTable, setShowTable] = useState(false);

  const { data, mutate, error } = useSWR("getAllTokenHolders", () => {
    return customerService.fetchCustomers({
      name,
      page: paginationModel.page,
      offset: paginationModel.pageSize,
      email: email || undefined,
      cpf: cpf || undefined,
      active: isActive || undefined,
      blocked: isBlocked || undefined,
      brazilian: isInBrazil || undefined,
      invited: isInvited || undefined,
      verified: isVerified,
    });
  });

  useEffect(() => {
    mutate();
  }, [paginationModel]);

  useEffect(() => {
    console.log({ teste: Object.keys(query).length > 0 });
    if (Object.keys(query).length > 0) {
      setName((query.name as string) || "");
      setEmail((query.email as string) || "");
      setCPF((query.cpf as string) || "");
      setIsVerified(query.verified === "true");
      setIsBlocked(query.blocked === "true");
      setIsActive(query.active === "true");
      setIsInvited(query.invited === "true");
      setIsInBrazil(query.brazilian === "true");
    }
  }, []);

  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.customers.map(
      ({
        cuid,
        firstName,
        lastName,
        cpfCnpj,
        email1,
        phone1,
        createdAt,
        verificationLevel,
        isBlocked,
        isActive,
        isInvited,
        isInBrazil,
        blockchainAccounts,
      }) => {
        return {
          id: cuid,
          firstName,
          lastName,
          cpfCnpj: cpfCnpj,
          email1,
          phone1,
          createdAt,
          verificationLevel,
          isBlocked: isBlocked ? "⛔" : "✅",
          isActive: asFlag(isActive),
          isInvited: asFlag(isInvited),
          isInBrazil: asFlag(isInBrazil),
          blockchainAccount: blockchainAccounts.length
            ? blockchainAccounts[0].publicKey
            : null,
        };
      }
    );
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!searchValue) return tableRows;

    const isLike = (a: string, b: string) => a.toLowerCase().indexOf(b) !== -1;

    return tableRows.filter(({ email1, cpfCnpj, firstName, lastName }) => {
      return (
        isLike(email1, searchValue) ||
        isLike(cpfCnpj, searchValue) ||
        isLike(firstName, searchValue) ||
        isLike(lastName, searchValue)
      );
    });
  }, [tableRows, searchValue]);

  const loading = !data && !error;

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/customers/${e.id}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <MainCard title="Token Holders">
      <CustomerSearchFilters
        name={name}
        setName={setName}
        isActive={isActive}
        setIsActive={setIsActive}
        email={email}
        setEmail={setEmail}
        isBlocked={isBlocked}
        setIsBlocked={setIsBlocked}
        isInBrazil={isInBrazil}
        setIsInBrazil={setIsInBrazil}
        isInvited={isInvited}
        setIsInvited={setIsInvited}
        isVerified={isVerified}
        setIsVerified={setIsVerified}
        setCPF={setCPF}
        setShowTable={setShowTable}
        cpf={cpf}
        fetchCustomers={() => {
          mutate();
        }}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ height: "auto" }}>
          {data!.customers.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {showTable && (
                <>
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    autoHeight
                    loading={loading}
                    onRowClick={handleRowClick}
                    hideFooter={true}
                    rowCount={data!.customers.length || undefined}
                  />
                  <Pagination
                    paginationModel={paginationModel}
                    setPaginationModel={setPaginationModel}
                    data={data as PaginationProps["data"]}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </MainCard>
  );
};
