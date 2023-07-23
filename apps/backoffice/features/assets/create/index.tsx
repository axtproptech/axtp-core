import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { CreateAssetActionCard } from "./components/createAssetActionCard";
import { useRouter } from "next/router";
import { singleQueryArg } from "@/app/singleQueryArg";

const gridSpacing = Config.Layout.GridSpacing;

export const CreateAsset = () => {
  const { query } = useRouter();
  const poolId = singleQueryArg(query.poolId);

  if (!poolId) return null;

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <CreateAssetActionCard poolId={poolId} />
      </Grid>
    </Grid>
  );
};
