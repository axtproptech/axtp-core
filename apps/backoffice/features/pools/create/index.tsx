import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { CreateActionCard } from "@/features/pools/create/components/createActionCard";

const gridSpacing = Config.Layout.GridSpacing;

export const CreatePool = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <CreateActionCard />
      </Grid>
    </Grid>
  );
};
