import { FC } from "react";

import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";

import { IconCash } from "@tabler/icons";
import { CardWrapperBlue } from "@/app/components/cards";
import { SkeletonStatusCard } from "./skeletonStatusCard";
import { Config } from "@/app/config";

interface Props {
  isLoading: boolean;
  balance: string;
}

export const StatusCard: FC<Props> = ({ balance, isLoading }) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonStatusCard />
      ) : (
        <CardWrapperBlue border={false} content={false}>
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
                        backgroundColor: theme.palette.primary[800],
                        mt: 1,
                      }}
                    >
                      <IconCash color={theme.palette.primary.light} />
                    </Avatar>
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
                        {balance}
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
      )}
    </>
  );
};
