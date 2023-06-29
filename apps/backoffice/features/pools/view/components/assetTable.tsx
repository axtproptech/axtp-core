import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
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
import { useAppContext } from "@/app/hooks/useAppContext";
import { Number } from "@/app/components/number";
import { Config } from "@/app/config";
import { ExternalLink } from "@/app/components/links/externalLink";
import { AssetAliasData } from "@axtp/core";
import { toDateStr } from "@/app/toDateStr";

const renderAsNumber = (params: GridRenderCellParams<string>) => (
  <Number value={parseFloat(params.value || "0")} />
);

const Action = ({ cuid }: { cuid: string }) => {
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

// const renderCustomer = (params: GridRenderCellParams<string>) => (
//   <CustomerAction cuid={params.value || ""} />
// );

const renderAsDate = (params: GridRenderCellParams<Date>) => {
  const date = params.value;
  if (!date) return null;
  return <Typography>{toDateStr(date)}</Typography>;
};

interface StatusObject {
  text: string;
}

// TODO: add color, icon etc
const AcquisitionStatus: Record<number, StatusObject> = {
  0: { text: "In Acquisition" },
  1: { text: "Renting" },
  2: { text: "Rehab (Section 8)" },
  3: { text: "Maintenance" },
  4: { text: "Sold" },
  5: { text: "Lost" },
};
const renderAcquisitionStatus = (params: GridRenderCellParams<number>) => {
  // @ts-ignore
  const status = AcquisitionStatus[params.value] ?? { text: "Unknown" };
  return <Typography>{status.text}</Typography>;
};

const AcquisitionProgress: Record<number, StatusObject> = {
  0: { text: "Paid" },
  1: { text: "Cert. Received" },
  2: { text: "Notified" },
  3: { text: "Acquired" },
  4: { text: "Recovered" },
};
const renderAcquisitionProgress = (params: GridRenderCellParams<number>) => {
  // @ts-ignore
  const status = AcquisitionProgress[params.value] ?? { text: "Unknown" };
  return <Typography>{status.text}</Typography>;
};

const getColumns = (): GridColDef[] => [
  { field: "name", headerName: "Name" },
  {
    field: "titleId",
    headerName: "Title Id",
    flex: 1,
  },
  {
    field: "acquisitionDate",
    headerName: `Acquisition Start Date`,
    flex: 1,
    renderCell: renderAsDate,
  },
  {
    field: "acquisitionProgress",
    headerName: "Progress",
    flex: 1,
    renderCell: renderAcquisitionProgress,
  },
  {
    field: "acquisitionStatus",
    headerName: `Status`,
    flex: 1,
    renderCell: renderAcquisitionStatus,
  },
  {
    field: "accumulatedCosts",
    headerName: `Accumulated Costs (USD)`,
    flex: 1,
    renderCell: renderAsNumber,
  },
  {
    field: "estimatedMarketValue",
    headerName: "Est. Market Value (USD)",
    flex: 1,
    renderCell: renderAsNumber,
  },
];

interface Props {
  poolId: string;
}

export const AssetTable: FC<Props> = ({ poolId }) => {
  const poolContractState = useAppSelector(selectPoolContractState(poolId));
  const { ledgerService } = useLedgerService();
  const [searchValue, setSearchValue] = useState("");

  const { data: assets, error } = useSWR(
    `pool/${poolId}/assets`,
    async () => {
      return ledgerService
        ? ledgerService.asset.fetchAllPoolAssetsData(poolId)
        : null;
    },
    {
      dedupingInterval: 60_000,
      refreshInterval: 120_000,
    }
  );

  const tableRows = useMemo(() => {
    if (!assets) {
      return [];
    }

    const data: (AssetAliasData & { id: string })[] = [];
    for (let [aliasId, assetAlias] of assets.entries()) {
      data.push({
        id: aliasId,
        ...assetAlias.getData(),
      });
    }
    return data;
  }, [assets]);

  const filteredRows = useMemo(() => {
    if (!searchValue) return tableRows;

    const isLike = (a: string, b: string) => a.toLowerCase().indexOf(b) !== -1;

    // TODO: more filter stuff, i.e. status, progress
    return tableRows.filter(({ name }) => {
      return isLike(name, searchValue);
    });
  }, [tableRows, searchValue]);

  const loading = !assets && !error;

  const columns = useMemo(() => {
    if (poolContractState) {
      return getColumns();
    } else {
      return [];
    }
  }, [poolContractState]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <MainCard title={"Assets"}>
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
        {/*<Grid item md={4}>*/}
        {/*  <Typography>*/}
        {/*    {`${tableRows.length} Token Holders holding ${overallTokensMinted} of at max. ${poolContractState.maxShareQuantity} shares`}*/}
        {/*  </Typography>*/}
        {/*</Grid>*/}
      </Grid>
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid rows={filteredRows} columns={columns} loading={loading} />
        </div>
      </div>
    </MainCard>
  );
};
