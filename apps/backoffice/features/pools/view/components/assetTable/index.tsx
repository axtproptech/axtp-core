import { MainCard } from "@/app/components/cards";
import React, { FC, useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Grid, Stack, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { SelectInput, TextInput } from "@/app/components/inputs";
import { ActionButton } from "@/app/components/buttons/actionButton";
import {
  IconCertificate,
  IconCertificate2,
  IconCertificateOff,
  IconCoinOff,
  IconCrane,
  IconHammer,
  IconHomeDollar,
  IconHomePlus,
  IconHomeShare,
  IconQuestionMark,
  IconReceipt2,
  IconShoppingCartPlus,
  IconUserSearch,
  TablerIcon,
} from "@tabler/icons";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { Number } from "@/app/components/number";
import { Config } from "@/app/config";
import { AssetAliasData } from "@axtp/core";
import { toDateStr } from "@/app/toDateStr";
import { AssetTableTitle } from "@/features/pools/view/components/assetTable/assetTableTitle";
import { Controller, useForm } from "react-hook-form";
import { usePoolAssets } from "@/app/hooks/usePoolAssets";

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
  icon: TablerIcon;
}

const AcquisitionStatus: Record<number, StatusObject> = {
  0: { text: "In Acquisition", icon: IconShoppingCartPlus },
  1: { text: "Renting", icon: IconHomeShare },
  2: { text: "Rehab (Section 8)", icon: IconCrane },
  3: { text: "Maintenance", icon: IconHammer },
  4: { text: "Sold", icon: IconHomeDollar },
  5: { text: "Lost", icon: IconCoinOff },
};
const renderAcquisitionStatus = (params: GridRenderCellParams<number>) => {
  // @ts-ignore
  const status = AcquisitionStatus[params.value] ?? {
    text: "Unknown",
    icon: IconQuestionMark,
  };
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <status.icon />
      <Typography>{status.text}</Typography>
    </Stack>
  );
};

const AcquisitionProgress: Record<number, StatusObject> = {
  0: { text: "Paid", icon: IconReceipt2 },
  1: { text: "Cert. Received", icon: IconCertificate },
  2: { text: "Notified", icon: IconCertificate2 },
  3: { text: "Acquired", icon: IconHomePlus },
  4: { text: "Recovered", icon: IconCertificateOff },
};
const renderAcquisitionProgress = (params: GridRenderCellParams<number>) => {
  // @ts-ignore
  const status = AcquisitionProgress[params.value] ?? {
    text: "Unknown",
    icon: IconQuestionMark,
  };
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <status.icon />
      <Typography>{status.text}</Typography>
    </Stack>
  );
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
    field: "gain",
    headerName: `Est. Gain (USD)`,
    flex: 1,
    renderCell: renderAsNumber,
  },
  {
    field: "performance",
    headerName: `Performance (%)`,
    flex: 1,
    renderCell: renderAsNumber,
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

interface FormValues {
  searchTerm: string;
  progress: string;
  status: string;
}

export const AssetTable: FC<Props> = ({ poolId }) => {
  const poolContractState = useAppSelector(selectPoolContractState(poolId));
  const { assets, isLoading } = usePoolAssets(poolId);

  const {
    control,
    watch,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const selectedStatus = watch("status");
  const selectedProgress = watch("progress");
  const searchTerm = watch("searchTerm");

  const tableRows = useMemo(() => {
    if (!assets) {
      return [];
    }

    const data: (AssetAliasData & {
      id: string;
      performance: number;
      gain: number;
    })[] = [];
    for (let [aliasId, assetAlias] of assets.entries()) {
      const assetData = assetAlias.getData();
      const performance =
        (assetData.estimatedMarketValue / assetData.accumulatedCosts) * 100;
      const gain = assetData.estimatedMarketValue - assetData.accumulatedCosts;
      data.push({
        id: aliasId,
        performance,
        gain,
        ...assetData,
      });
    }
    return data;
  }, [assets]);

  const filteredRows = useMemo(() => {
    const isLike = (a: string, b = searchTerm) =>
      a.toLowerCase().indexOf(b) !== -1;

    return tableRows.filter(
      ({ name, titleId, acquisitionProgress, acquisitionStatus }) => {
        const matchesText = searchTerm ? isLike(name) || isLike(titleId) : true;
        const matchesProgress = selectedProgress
          ? selectedProgress === acquisitionProgress.toString()
          : true;
        const matchesStatus = selectedStatus
          ? selectedStatus === acquisitionStatus.toString()
          : true;
        return matchesText && matchesProgress && matchesStatus;
      }
    );
  }, [tableRows, searchTerm, selectedProgress, selectedStatus]);

  const columns = useMemo(() => {
    if (poolContractState) {
      return getColumns();
    } else {
      return [];
    }
  }, [poolContractState]);

  const progressOptions = useMemo(() => {
    const options = new Map<number, { label: string; value: string }>();
    options.set(-1, { value: "", label: "---" });
    for (let r of tableRows) {
      options.set(r.acquisitionProgress, {
        value: r.acquisitionProgress.toString(),
        label: (
          AcquisitionProgress[r.acquisitionProgress] ?? { text: "Unknown" }
        ).text,
      });
    }
    return Array.from(options.values());
  }, [tableRows]);

  const statusOptions = useMemo(() => {
    const options = new Map<number, { label: string; value: string }>();
    options.set(-1, { value: "", label: "---" });
    for (let r of tableRows) {
      options.set(r.acquisitionStatus, {
        value: r.acquisitionStatus.toString(),
        label: (AcquisitionStatus[r.acquisitionStatus] ?? { text: "Unknown" })
          .text,
      });
    }
    return Array.from(options.values());
  }, [tableRows]);

  return (
    <MainCard title={<AssetTableTitle assets={filteredRows} />}>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={Config.Layout.GridSpacing}
      >
        <Grid item md={4}>
          <Controller
            render={({ field }) => (
              <TextInput
                {...field}
                label="Text Search"
                aria-autocomplete="none"
              />
            )}
            name="searchTerm"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </Grid>
        <Grid item md={2}>
          <Controller
            render={({ field }) => (
              <SelectInput
                label="Progress"
                options={progressOptions}
                {...field}
              />
            )}
            name="progress"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </Grid>

        <Grid item md={2}>
          <Controller
            render={({ field }) => (
              <SelectInput label="Status" options={statusOptions} {...field} />
            )}
            name="status"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </Grid>
      </Grid>
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid rows={filteredRows} columns={columns} loading={isLoading} />
        </div>
      </div>
    </MainCard>
  );
};
