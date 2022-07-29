import { FC, useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import { CardWrapperBlue } from "@/app/components/cards";
import { SkeletonStatusCard } from "./skeletonStatusCard";
import { Config } from "@/app/config";
import { Amount } from "@signumjs/util";

interface Props {
  isLoading: boolean;
  balance: string;
}

export const StatusCard: FC<Props> = ({ balance, isLoading }) => {
  const theme = useTheme();

  const balanceAmount = useMemo(() => {
    try {
      return Amount.fromSigna(balance);
    } catch (e) {
      return Amount.Zero();
    }
  }, [balance]);

  if (isLoading || balanceAmount === null || balanceAmount === undefined) {
    return <SkeletonStatusCard />;
  }

  const isBalanceLow = balanceAmount.less(
    Config.MasterContract.LowBalanceThreshold
  );

  return (
    <CardWrapperBlue border={false} content={false}>
      <Box sx={{ p: 2.25 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Stack direction="row" alignItems="center">
                  <Avatar
                    variant="rounded"
                    sx={{
                      // @ts-ignore
                      ...theme.typography.commonAvatar,
                      // @ts-ignore
                      ...theme.typography.largeAvatar,
                      // @ts-ignore
                      backgroundColor: theme.palette.primary[800],
                      mt: 1,
                    }}
                  >
                    {isBalanceLow ? (
                      <WarningAmberRoundedIcon color="warning" />
                    ) : (
                      <PriceCheckRoundedIcon color="success" />
                    )}
                  </Avatar>
                  {isBalanceLow && (
                    <Typography
                      sx={{
                        fontWeight: 600,
                        ml: 1,
                      }}
                    >
                      Low Balance: Please recharge contract!
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Stack direction="row" alignItems="baseline">
                  <Typography
                    sx={{
                      fontSize: "2.125rem",
                      fontWeight: 500,
                      mr: 1,
                      mt: 1.75,
                      mb: 0.75,
                    }}
                  >
                    {balanceAmount.getSigna()}
                  </Typography>
                  <Typography>
                    {Config.Signum.TickerSymbol.toUpperCase()}
                  </Typography>
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
                color: theme.palette.secondary.light,
              }}
            >
              Contract Balance
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </CardWrapperBlue>
  );
};
