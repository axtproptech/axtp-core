import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
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
  const totalPages = Math.ceil(data!.count / paginationModel.pageSize);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Rows per Page:
        </Typography>
        <Select
          value={paginationModel.pageSize}
          onChange={(e) =>
            onPaginationChange({
              page: 1,
              pageSize: e.target.value as number,
            })
          }
        >
          {[5, 10, 20, 25, 50].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
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
        <Box sx={{ mx: 1, display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mx: 1 }}>
            Page: {paginationModel.page} / {totalPages}
          </Typography>
        </Box>
        <Button
          disabled={
            !data ||
            paginationModel.page * paginationModel.pageSize >= data.count
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
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6">
          Total:{" "}
          {Math.min(
            paginationModel.page * paginationModel.pageSize,
            data?.count || 0
          )}{" "}
          of {data?.count || 0}
        </Typography>
      </Box>
    </Box>
  );
};
