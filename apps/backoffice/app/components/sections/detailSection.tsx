import { FC } from "react";
import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { ChildrenProps } from "@/types/childrenProps";

const gridSpacing = Config.Layout.GridSpacing;

export const DetailSection: FC<ChildrenProps> = ({ children }) => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        {children}
      </Grid>
    </Grid>
  );
};
