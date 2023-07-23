import { Box, Grid, Typography } from "@mui/material";
import { Config } from "@/app/config";
import { CardWrapperDark } from "@/app/components/cards";
import { useTheme } from "@mui/material/styles";
import { PoolCard } from "@/features/pools/view/components/poolCard";
import { Animate } from "@/app/components/animation";
import Link from "next/link";
import { selectAllPools } from "@/app/states/poolsState";
import { useAppSelector } from "@/states/hooks";

const gridSpacing = Config.Layout.GridSpacing;

export const AllPools = () => {
  const theme = useTheme();
  const pools = useAppSelector(selectAllPools);

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={4}>
          {/*<CardWrapperDark>*/}
          {/*  <Typography variant="h2" color={theme.palette.primary.light}>*/}
          {/*    Overall performance card here*/}
          {/*  </Typography>*/}
          {/*</CardWrapperDark>*/}
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Grid
          container
          spacing={gridSpacing}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {pools.map((data) => (
            <Grid item xs={2} sm={4} md={4} key={data.poolId}>
              <Box sx={{ cursor: "pointer" }}>
                <Animate scale={{ hover: 1.025, tap: 0.975 }}>
                  <Link href={`/admin/pools/${data.poolId}`}>
                    <div>
                      <PoolCard data={data} />
                    </div>
                  </Link>
                </Animate>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
