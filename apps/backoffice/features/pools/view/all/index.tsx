import { Box, Grid, Typography } from "@mui/material";
import { Config } from "@/app/config";
import { CardWrapperDark } from "@/app/components/cards";
import { useTheme } from "@mui/material/styles";
import { PoolCard } from "@/features/pools/view/components/poolCard";
import { Animate } from "@/app/components/animation";
import Link from "next/link";

const mockedPools = [
  {
    id: "1",
    tokenSymbol: "PST0001",
    rate: 3000,
    maxTokenCount: 100,
    circulatingTokenCount: 32,
    pendingPayout: 15000,
    paid: 127500,
  },
  {
    id: "2",
    tokenSymbol: "PST0002",
    rate: 5000,
    maxTokenCount: 75,
    circulatingTokenCount: 73,
    pendingPayout: 0,
    paid: 87450,
  },
  {
    id: "3",
    tokenSymbol: "PST0003",
    rate: 12500,
    maxTokenCount: 15,
    circulatingTokenCount: 10,
    pendingPayout: 0,
    paid: 150000,
  },
];

const gridSpacing = Config.Layout.GridSpacing;

export const AllPools = () => {
  const theme = useTheme();
  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={4}>
          <CardWrapperDark>
            <Typography variant="h2" color={theme.palette.primary.light}>
              Overall performance card here
            </Typography>
          </CardWrapperDark>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Grid
          container
          spacing={gridSpacing}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {mockedPools.map((data) => (
            <Grid item xs={2} sm={4} md={4} key={data.tokenSymbol}>
              <Box sx={{ cursor: "pointer" }}>
                <Animate scale={{ hover: 1.025, tap: 0.975 }}>
                  <Link href={`/admin/pools/${data.id}`}>
                    <PoolCard data={data} />
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
