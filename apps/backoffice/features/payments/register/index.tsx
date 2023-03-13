import { Config } from "@/app/config";
import { Grid } from "@mui/material";
import { RegisterPaymentCard } from "./components/registerPaymentCard";

const gridSpacing = Config.Layout.GridSpacing;

export const RegisterPayment = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <RegisterPaymentCard />
      </Grid>
    </Grid>
  );
};
