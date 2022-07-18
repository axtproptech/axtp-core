import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { StatusCard } from "./components/statusCard";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import useSWR from "swr";

const gridSpacing = Config.Layout.GridSpacing;

export const MasterContractView = () => {
  const { ledgerService } = useLedgerService();

  const { data, error } = useSWR(
    ledgerService ? "fetch/contractData" : null,
    async () => {
      if (!ledgerService) return null;
      return ledgerService.masterContract.readContractData();
    },
    {
      revalidateOnMount: false,
      refreshInterval: 120_000,
    }
  );

  const isLoading = !data && !error;

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <StatusCard
              isLoading={isLoading}
              balance={data ? data.balance.getSigna() : "0"}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};
