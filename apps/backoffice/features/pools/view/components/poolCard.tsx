import { FC, useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Chip, Grid, Stack, Typography } from "@mui/material";

import { IconCash, IconFlame, IconSeeding } from "@tabler/icons";
import { CardWrapperBlue } from "@/app/components/cards";
import NumberFormat from "react-number-format";
// @ts-ignore
import hashicon from "hashicon";

export interface PoolData {
  id: string;
  tokenSymbol: string;
  rate: number;
  maxTokenCount: number;
  circulatingTokenCount: number;
  pendingPayout: number;
  paid: number;
}

interface Props {
  data: PoolData;
}

export const PoolCard: FC<Props> = ({ data }) => {
  const theme = useTheme();
  const {
    id,
    pendingPayout,
    paid,
    rate,
    maxTokenCount,
    circulatingTokenCount,
    tokenSymbol,
  } = data;

  const liquidity = rate * maxTokenCount;

  const iconUrl = useMemo(() => {
    if (!id) return "";
    return hashicon(id, { size: 32 }).toDataURL();
  }, [id]);

  return (
    <>
      <CardWrapperBlue border={false} content={false}>
        <Box sx={{ p: 2.25 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Chip
                    label={tokenSymbol}
                    color="primary"
                    avatar={<img src={iconUrl} alt={id} />}
                  />
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
                        decimalScale={2}
                        fixedDecimalScale
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
                      <Typography>+ {pendingPayout}</Typography>
                    </Stack>
                    <Stack
                      justifyContent="start"
                      direction="row"
                      alignItems="center"
                    >
                      <IconFlame />
                      &nbsp;
                      <Typography>- {paid}</Typography>
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
      </CardWrapperBlue>
    </>
  );
};
