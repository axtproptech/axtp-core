import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import React, { ChangeEvent, FC, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { TextInput } from "@/app/components/inputs";
import { ActionButton } from "@/app/components/buttons/actionButton";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconUserSearch,
} from "@tabler/icons";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { CustomerResponse } from "@/bff/types/customerResponse";
import { selectMasterContractState } from "@/app/states/masterContractState";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Number } from "@/app/components/number";
import { Config } from "@/app/config";
import { ExternalLink } from "@/app/components/links/externalLink";

const renderAsNumber = (params: GridRenderCellParams<string>) => (
  <Number value={parseFloat(params.value || "0")} />
);

const renderAccount = (params: GridRenderCellParams<string>) => (
  <ExternalLink
    href={`${Config.Signum.Explorer}address/${params.row["account"]}`}
  >
    {params.value}
  </ExternalLink>
);

const renderBlockedOrInactive = (params: GridRenderCellParams<boolean>) => {
  return (
    <Tooltip
      title={!params.value ? "All fine" : "Holder is blocked or inactive"}
    >
      <div>
        {!params.value ? (
          <IconCircleCheck color="green" />
        ) : (
          <IconAlertCircle color="red" />
        )}
      </div>
    </Tooltip>
  );
};

const CustomerAction = ({ cuid }: { cuid: string }) => {
  const router = useRouter();
  if (!cuid) {
    return (
      <Tooltip title={"This holder is not registered"}>
        <Typography>No Customer</Typography>
      </Tooltip>
    );
  }

  const handleOnCLick = async (e: React.SyntheticEvent) => {
    try {
      e.stopPropagation();
      await router.push(`/admin/customers/${cuid}`);
    } catch (err: any) {}
  };

  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title="Click to view customer details">
        <div>
          <ActionButton
            actionLabel={"View"}
            actionIcon={<IconUserSearch />}
            onClick={handleOnCLick}
          />
        </div>
      </Tooltip>
    </Stack>
  );
};

const renderCustomer = (params: GridRenderCellParams<string>) => (
  <CustomerAction cuid={params.value || ""} />
);

const renderAXTP = (params: GridRenderCellParams<string>) => {
  return (
    <Stack direction="row">
      <Typography>{params.value}</Typography>
      <Tooltip title={"Percentual Share amongst all token holders"}>
        <Typography sx={{ ml: 1 }} variant="caption">{`${
          params.row["axtpShare"] || 0
        } %`}</Typography>
      </Tooltip>
    </Stack>
  );
};

interface GetColumnsArgs {
  symbolAXTC: string;
  symbolAXTP: string;
  symbolSIGNA: string;
}

const getColumns = (args: GetColumnsArgs): GridColDef[] => [
  { field: "name", headerName: "Name" },
  {
    field: "accountRS",
    headerName: "Account",
    flex: 1,
    renderCell: renderAccount,
  },
  {
    field: "axtp",
    headerName: `Balance ${args.symbolAXTP}`,
    flex: 1,
    renderCell: renderAXTP,
  },
  {
    field: "axtc",
    headerName: `Balance ${args.symbolAXTC}`,
    flex: 1,
    renderCell: renderAsNumber,
  },
  {
    field: "signa",
    headerName: `Balance ${args.symbolSIGNA}`,
    flex: 1,
    renderCell: renderAsNumber,
  },
  {
    field: "isBlockedOrNotActive",
    headerName: "Status",
    flex: 1,
    renderCell: renderBlockedOrInactive,
  },
  {
    field: "cuid",
    headerName: "Customer",
    flex: 1,
    renderCell: renderCustomer,
  },
];

interface TokenHolder {
  publicKey: string;
  account: string;
  accountRS: string;
  balanceSigna: string;
  balanceAXTC: string;
  balanceAXTP: string;
  customer?: CustomerResponse;
}

interface Props {
  poolId: string;
}

export const TokenHolderTable: FC<Props> = ({ poolId }) => {
  const poolContractState = useAppSelector(selectPoolContractState(poolId));
  const masterContractState = useAppSelector(selectMasterContractState);
  const { Ledger } = useAppContext();
  const { ledgerService } = useLedgerService();
  const [searchValue, setSearchValue] = useState("");
  const [fetchingProgress, setFetchingProgress] = useState<{
    total: number;
    fetched: number;
  }>({ total: 100, fetched: 100 });

  const { data } = useSWR(
    `pool/${poolId}/holders`,
    async () => {
      if (!ledgerService) return null;
      if (!poolContractState) return null;

      setFetchingProgress({ total: 0, fetched: 0 });

      let tokenHolders = (await ledgerService.poolContract
        .with(poolId)
        .getAllTokenHolders(poolContractState.token.id)) as TokenHolder[];

      setFetchingProgress({ total: tokenHolders.length, fetched: 0 });

      for (let tokenHolder of tokenHolders) {
        const { account } = tokenHolder;
        try {
          tokenHolder.customer = await customerService.fetchCustomerByAccountId(
            account
          );
        } catch (e: any) {
          // ignore - token holder has no customer
        } finally {
          const { total, fetched } = fetchingProgress;
          setFetchingProgress({ total, fetched: fetched + 1 });
        }
      }
      return tokenHolders;
    },
    {
      dedupingInterval: 45_000,
      refreshInterval: 90_000,
    }
  );

  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }
    const totalMintedTokens = data.reduce(
      (p, c) => p + parseInt(c.balanceAXTP),
      0
    );

    return data.map(
      ({
        customer,
        account,
        accountRS,
        balanceAXTC,
        balanceAXTP,
        balanceSigna,
      }) => {
        const name = customer
          ? `${customer.firstName} ${customer.lastName}`
          : "";
        const cuid = customer ? customer.cuid : null;
        const isBlockedOrNotActive = customer
          ? customer.isBlocked || !customer.isActive
          : false;

        const axtpShare = (
          (parseFloat(balanceAXTP || "0") / totalMintedTokens) *
          100
        ).toFixed(2);
        return {
          id: account,
          cuid,
          name,
          isBlockedOrNotActive,
          accountRS,
          account,
          signa: balanceSigna,
          axtc: balanceAXTC,
          axtp: balanceAXTP,
          axtpShare,
        };
      }
    );
  }, [data]);

  const overallTokensMinted = useMemo(
    () => tableRows.reduce((p, c) => p + parseInt(c.axtp), 0),
    [tableRows]
  );

  const filteredRows = useMemo(() => {
    if (!searchValue) return tableRows;

    const isLike = (a: string, b: string) => a.toLowerCase().indexOf(b) !== -1;

    return tableRows.filter(({ name, accountRS }) => {
      return isLike(name, searchValue) || isLike(accountRS, searchValue);
    });
  }, [tableRows, searchValue]);

  const progress =
    fetchingProgress.total > 0
      ? Math.ceil((fetchingProgress.fetched / fetchingProgress.total) * 100)
      : 0;
  const loading = progress < 100;

  const columns = useMemo(() => {
    if (poolContractState && masterContractState) {
      return getColumns({
        symbolAXTC: masterContractState.token.name,
        symbolAXTP: poolContractState.token.name,
        symbolSIGNA: Ledger.Ticker,
      });
    } else {
      return [];
    }
  }, [poolContractState, masterContractState, Ledger.Ticker]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <MainCard title={"Token Holders"}>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={Config.Layout.GridSpacing}
      >
        <Grid item md={4}>
          <TextInput
            label="Search"
            onChange={handleSearch}
            value={searchValue}
          />
        </Grid>
        <Grid item md={4}>
          <Typography>
            {`${tableRows.length} Token Holders holding ${overallTokensMinted} of at max. ${poolContractState.maxShareQuantity} shares`}
          </Typography>
        </Grid>
      </Grid>
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            components={{
              LoadingOverlay: CircularProgress,
            }}
            componentsProps={{
              loadingOverlay: { variant: "determinate", value: progress },
            }}
          />
        </div>
      </div>
    </MainCard>
  );
};
