import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { StatusCard } from "./components/statusCard";
import { ChargeContractCard } from "./components/chargeContractCard";
import { useMasterContract } from "@/app/hooks/useMasterContract";

const gridSpacing = Config.Layout.GridSpacing;

export const MasterContractView = () => {
  const { isLoading, balance } = useMasterContract();

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item sm={6} xs={12}>
            <StatusCard isLoading={isLoading} balance={balance} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <ChargeContractCard />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};
