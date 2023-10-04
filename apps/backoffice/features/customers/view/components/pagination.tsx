import { Button, MenuItem, Select } from "@mui/material";
import React from "react";

export interface PaginationProps {
  paginationModel: {
    page: number;
    pageSize: number;
  };
  onPaginationChange: (paginationModel: {
    page: number;
    pageSize: number;
  }) => void;
  data: {
    [key: string]: any;
    count: number;
  } | null;
}

export const Pagination = ({
  paginationModel,
  onPaginationChange,
  data,
}: PaginationProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
      }}
      className="pagination"
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4 style={{ marginRight: 20 }}>Rows per Page: </h4>
        <Select
          value={paginationModel.pageSize}
          onChange={(e) =>
            onPaginationChange({
              ...paginationModel,
              pageSize: e.target.value as number,
            })
          }
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          disabled={paginationModel.page === 1}
          variant="outlined"
          onClick={() =>
            onPaginationChange({
              ...paginationModel,
              page: paginationModel.page - 1,
            })
          }
        >
          Previous
        </Button>
        <div
          style={{ margin: "0 10px", display: "flex", alignItems: "center" }}
        >
          <h4 style={{ margin: "0 5px" }}>Page:</h4>
          <h4>{paginationModel.page}</h4>
        </div>
        <Button
          disabled={
            paginationModel.page * paginationModel.pageSize >= data!.count
          }
          variant="outlined"
          onClick={() =>
            onPaginationChange({
              ...paginationModel,
              page: paginationModel.page + 1,
            })
          }
        >
          Next
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4>Total: </h4>
        <h4>
          {paginationModel.page * paginationModel.pageSize > data!.count
            ? data!.count
            : paginationModel.page * paginationModel.pageSize}{" "}
          of {data!.count}
        </h4>
      </div>
    </div>
  );
};
