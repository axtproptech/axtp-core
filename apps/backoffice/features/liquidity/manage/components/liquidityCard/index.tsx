import { FC } from "react";

import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";

import { IconCash, IconFlame, IconSeeding } from "@tabler/icons";
import { CardWrapperDark } from "@/app/components/cards";
import { SkeletonLiquidityCard } from "./skeletonLiquidityCard";
import NumberFormat from "react-number-format";

interface Props {
  isLoading: boolean;
  tokenSymbol: string;
  liquidity: string;
  burnLiquidity: string;
  mintLiquidity: string;
}

export const LiquidityCard: FC<Props> = ({
  burnLiquidity,
  mintLiquidity,
  liquidity,
  tokenSymbol,
  isLoading,
}) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonLiquidityCard />
      ) : (
        <CardWrapperDark border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        // @ts-ignore
                        ...theme.typography.commonAvatar,
                        // @ts-ignore
                        ...theme.typography.largeAvatar,
                        // @ts-ignore
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1,
                      }}
                    >
                      <IconCash color={theme.palette.secondary.light} />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Stack direction="row" spacing={2} alignItems="baseline">
                      <Typography
                        sx={{
                          fontSize: "2.125rem",
                          fontWeight: 500,
                          mt: 1.75,
                          mb: 0.75,
                        }}
                      >
                        <NumberFormat
                          value={liquidity}
                          displayType="text"
                          thousandSeparator
                        />
                      </Typography>
                      <Typography>{tokenSymbol.toUpperCase()}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Stack
                        justifyContent="start"
                        direction="row"
                        alignItems="center"
                      >
                        <IconSeeding />
                        &nbsp;
                        <Typography>+ {mintLiquidity}</Typography>
                      </Stack>
                      <Stack
                        justifyContent="start"
                        direction="row"
                        alignItems="center"
                      >
                        <IconFlame />
                        &nbsp;
                        <Typography>- {burnLiquidity}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    // @ts-ignore
                    color: theme.palette.secondary[200],
                  }}
                >
                  Total Liquidity
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapperDark>
      )}
    </>
  );
};
