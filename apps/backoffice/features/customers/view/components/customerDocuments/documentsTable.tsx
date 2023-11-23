import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { toDateStr } from "@/app/toDateStr";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { DownloadButton } from "@/app/components/buttons/downloadButton";
import { DocumentDeleteButton } from "./documentDeleteButton";
import { Stack } from "@mui/material";

const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const createdAt = params.value;
  if (!createdAt) return null;
  return <div>{toDateStr(new Date(createdAt))}</div>;
};

const renderActions = (params: GridRenderCellParams<string>) => {
  const { cuid, id, url } = params.row;
  return (
    <Stack direction="row" spacing={0.5}>
      <DownloadButton url={url} size="small" />
      <DocumentDeleteButton documentId={id} cuid={cuid} size="small" />
    </Stack>
  );
};

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Uploaded", renderCell: renderCreatedAt },
  { field: "type", headerName: "Document Type", flex: 2 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    align: "right",
    renderCell: renderActions,
  },
];

interface Props {
  customer: CustomerFullResponse;
}

export const DocumentsTable = ({ customer }: Props) => {
  const tableRows = useMemo(() => {
    return customer.documents.map(({ createdAt, id, type, url }) => {
      return {
        id,
        cuid: customer.cuid,
        type,
        url,
        createdAt,
      };
    });
  }, [customer]);

  return (
    <>
      <DataGrid
        rows={tableRows}
        columns={columns}
        autoHeight
        hideFooter={true}
        rowCount={tableRows.length}
      />
    </>
  );
};
