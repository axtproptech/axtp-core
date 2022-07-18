import { Card, CardContent, Grid, Skeleton } from "@mui/material";

export const SkeletonStatusCard = () => (
  <Card>
    <CardContent>
      <Grid container direction="column">
        <Grid item>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Skeleton variant="rectangular" width={44} height={44} />
            </Grid>
            <Grid item>
              <Skeleton variant="rectangular" width={34} height={34} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Skeleton variant="rectangular" sx={{ my: 2 }} height={40} />
        </Grid>
        <Grid item>
          <Skeleton variant="rectangular" height={30} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
