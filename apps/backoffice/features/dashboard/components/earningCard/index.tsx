import { FC, useState } from "react";

import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from "@mui/material";

import { IconCash } from "@tabler/icons";
import { CardWrapperDark } from "@/app/components/cards";
import { SkeletonEarningCard } from "./skeletonEarningCard";
import Link from "next/link";
import { Animate } from "@/app/components/animation";

interface Props {
  isLoading: boolean;
}

export const EarningCard: FC<Props> = ({ isLoading }) => {
  const theme = useTheme();

  return (
    <Animate scale={{ hover: 1.025, tap: 0.975 }}>
      <Link href="/admin/liquidity">
        {isLoading ? (
          <SkeletonEarningCard />
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
                      <Typography
                        sx={{
                          fontSize: "2.125rem",
                          fontWeight: 500,
                          mr: 1,
                          mt: 1.75,
                          mb: 0.75,
                        }}
                      >
                        1.500.000,00
                      </Typography>
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
      </Link>
    </Animate>
  );
};
