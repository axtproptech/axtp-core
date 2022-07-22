import { FC, useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import {
  Speed as IconSpeed,
  Payments as IconPayments,
  People as IconPeople,
} from "@mui/icons-material";
import { CardWrapperBlue } from "@/app/components/cards";
import NumberFormat from "react-number-format";
// @ts-ignore
import hashicon from "hashicon";
import { useMasterContract } from "@/app/hooks/useMasterContract";

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
  const { token } = useMasterContract();

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

  const initialLiquidity = rate * maxTokenCount;
  const performancePercent =
    ((initialLiquidity + paid) / initialLiquidity) * 100;
  const occupationPercent = (circulatingTokenCount / maxTokenCount) * 100;

  return (
    <CardWrapperBlue border={false} content={false}>
      <Box sx={{ p: 2.25 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Chip
                  label={tokenSymbol}
                  color="primary"
                  avatar={
                    <img
                      src={iconUrl}
                      alt={id}
                      style={{ backgroundColor: "transparent" }}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="baseline">
                  <Tooltip title="Nominal Base Valuation">
                    <>
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
                      <Typography>{token.name.toUpperCase()}</Typography>
                    </>
                  </Tooltip>
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
                    <IconPayments />
                    &nbsp;
                    <Typography>
                      <NumberFormat
                        value={paid}
                        displayType="text"
                        decimalScale={2}
                        fixedDecimalScale
                        thousandSeparator
                      />{" "}
                      {token.name.toUpperCase()}
                    </Typography>
                  </Stack>
                  <Stack
                    justifyContent="start"
                    direction="row"
                    alignItems="center"
                  >
                    <IconSpeed />
                    &nbsp;
                    <Typography>
                      <NumberFormat
                        value={performancePercent}
                        displayType="text"
                        decimalScale={2}
                        fixedDecimalScale
                        thousandSeparator
                      />{" "}
                      %
                    </Typography>
                  </Stack>
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
                    <IconPeople />
                    &nbsp;
                    <Typography>
                      {`${circulatingTokenCount}/${maxTokenCount}`} (
                      <NumberFormat
                        value={occupationPercent}
                        displayType="text"
                        decimalScale={2}
                        fixedDecimalScale
                        thousandSeparator
                      />{" "}
                      %)
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapperBlue>
  );
};
