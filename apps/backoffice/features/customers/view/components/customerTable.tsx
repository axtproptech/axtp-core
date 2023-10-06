import { MainCard } from "@/app/components/cards";
import React, { useEffect, useMemo, useState } from "react";
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
import { Pagination } from "./pagination";
import { CustomerTableResponse } from "@/bff/types/customerResponse";
import useSWRMutation from "swr/mutation";
import CircularProgress from "@mui/material/CircularProgress";

import { customerService } from "@/app/services/customerService/customerService";
import { CustomerFilterType, PaginationModelType } from "./types";
import { set } from "nprogress";

const Days = 1000 * 60 * 60 * 24;
const renderCreatedAt = (params: GridRenderCellParams<string>) => {
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

const getQueryParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param || "";
};

const getBooleanQueryParam = (
  param: string | string[] | undefined
): boolean | undefined => {
  if (param === "true") return true;
  if (param === "false") return false;
  return undefined;
};

export const CustomerTable = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<CustomerFilterType>({
    name: "",
    email: undefined,
    cpf: undefined,
    verified: true,
    blocked: undefined,
    active: undefined,
    invited: undefined,
    brazilian: undefined,
  });
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 1,
    pageSize: 5,
  });
  const [hasUpdatedFromQuery, setHasUpdatedFromQuery] = useState(false);

  const [data, setData] = useState<CustomerTableResponse>();

  const { trigger, isMutating } = useSWRMutation<
    CustomerTableResponse,
    any,
    "getAllTokenHolders",
    CustomerFilterType
  >("getAllTokenHolders", (_, { arg }) => {
    return customerService.fetchCustomers({
      page: paginationModel.page,
      offset: paginationModel.pageSize,
      ...filters,
      ...arg,
    });
  });

  useEffect(() => {
    if (!router.isReady || hasUpdatedFromQuery) return;

    const updatedFilters: CustomerFilterType = {
      name: getQueryParam(router.query.name) || "",
      email: getQueryParam(router.query.email) || undefined,
      cpf: getQueryParam(router.query.cpf) || undefined,
      verified: getBooleanQueryParam(router.query.verified) || true,
      blocked: getBooleanQueryParam(router.query.blocked) || undefined,
      active: getBooleanQueryParam(router.query.active) || undefined,
      invited: getBooleanQueryParam(router.query.invited) || undefined,
      brazilian: getBooleanQueryParam(router.query.brazilian) || undefined,
    };

    const updatePaginationModel: PaginationModelType = {
      page: Number(router.query.page) || 1,
      pageSize: Number(router.query.pageSize) || 5,
      offset: Number(router.query.pageSize) || 5,
    };

    setFilters({ ...updatedFilters });
    setPaginationModel({ ...updatePaginationModel });
    trigger({ ...updatedFilters, ...updatePaginationModel }).then((data) =>
      setData(data)
    );
    setHasUpdatedFromQuery(true);
  }, [router.query, router.isReady, hasUpdatedFromQuery]);

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
  }, [data, paginationModel]);

  const setQueryParamsUrl = (filters: any) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== undefined)
    ) as CustomerFilterType;

    router.replace(
      {
        pathname: router.pathname,
        query: cleanedFilters,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/customers/${e.id}`);
  };

  const handlePaginationChange = async (
    newPaginationModel: PaginationModelType
  ) => {
    const filterToFetch = {
      ...newPaginationModel,
      ...filters,
      offset: newPaginationModel.pageSize,
    };
    const dataFetch = await trigger(filterToFetch);
    setData(dataFetch);
    setPaginationModel(newPaginationModel);
    setQueryParamsUrl(filterToFetch);
  };

  const handleOnSearch = async (filters: CustomerFilterType) => {
    const paginationModelReset = { ...paginationModel, page: 1 };
    const filterToFetch = { ...filters, ...paginationModelReset };
    setPaginationModel(paginationModelReset);
    setFilters(filters);
    const dataFetch = await trigger(filterToFetch);
    setData(dataFetch);
    setQueryParamsUrl(filterToFetch);
  };

  const loading = (!data && isMutating) || isMutating;

  return (
    <MainCard title="Token Holders">
      <CustomerSearchFilters onSearch={handleOnSearch} />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <CustomerDataGrid
          data={data}
          loading={loading}
          handleRowClick={handleRowClick}
          tableRows={tableRows}
          columns={columns}
          paginationModel={paginationModel}
          handlePaginationChange={handlePaginationChange}
        />
      )}
    </MainCard>
  );
};

interface CustomerDataGridProps {
  data: CustomerTableResponse | undefined;
  loading: boolean;
  handleRowClick: (e: GridRowParams) => void;
  tableRows: any[];
  columns: GridColDef[];
  paginationModel: {
    page: number;
    pageSize: number;
  };
  handlePaginationChange: (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => void;
}

const CustomerDataGrid: React.FC<CustomerDataGridProps> = ({
  data,
  loading,
  handleRowClick,
  tableRows,
  columns,
  paginationModel,
  handlePaginationChange,
}) => {
  if (!data || data.customers.length === 0) return null;

  return (
    <>
      <DataGrid
        rows={tableRows}
        columns={columns}
        autoHeight
        loading={loading}
        onRowClick={handleRowClick}
        hideFooter={true}
        rowCount={data.customers.length}
      />
      <Pagination
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        data={data}
      />
    </>
  );
};
