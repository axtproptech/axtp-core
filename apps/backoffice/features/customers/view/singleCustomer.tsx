import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { FC } from "react";
import { customerService } from "@/app/services/customerService/customerService";
import useSWR from "swr";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  cuid: string;
}

export const SingleCustomer: FC<Props> = ({ cuid }) => {
  const { data, error } = useSWR(`getCustomer/${cuid}`, () => {
    return customerService.fetchCustomer(cuid);
  });

  const loading = !data && !error;

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <h2>{loading ? "Loading..." : data?.firstName}</h2>
      </Grid>
    </Grid>
  );
};
