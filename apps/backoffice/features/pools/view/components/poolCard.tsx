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
import { PoolContractData } from "@/types/poolContractData";

interface Props {
  data: PoolContractData;
}

export const PoolCard: FC<Props> = ({ data }) => {
  const masterContract = useMasterContract();

  const stcTokenSymbol = masterContract.token.name;

  const { poolId, paidDistribution, token, nominalLiquidity } = data;

  console.log("PoolCard", data);

  const iconUrl = useMemo(() => {
    if (!poolId) return "";
    return hashicon(poolId, { size: 32 }).toDataURL();
  }, [poolId]);

  const performancePercent =
    ((nominalLiquidity + paidDistribution) / nominalLiquidity) * 100;
  const occupationPercent =
    (parseInt(token?.quantity || "0") / parseInt(token?.supply || "0")) * 100;

  return (
    <CardWrapperBlue border={false} content={false}>
      <Box sx={{ p: 2.25 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Chip
                  label={token.name.toUpperCase()}
                  color="primary"
                  avatar={
                    <img
                      src={iconUrl}
                      alt={poolId}
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
                  <Tooltip arrow title="Initial Base Valuation">
                    <Typography
                      sx={{
                        fontSize: "2.125rem",
                        fontWeight: 500,
                        mt: 1.75,
                        mb: 0.75,
                      }}
                    >
                      <NumberFormat
                        value={nominalLiquidity}
                        displayType="text"
                        decimalScale={2}
                        fixedDecimalScale
                        thousandSeparator
                      />
                    </Typography>
                  </Tooltip>
                  <Typography>{stcTokenSymbol}</Typography>
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
                    <Tooltip arrow title="Paid Distribution">
                      <Typography>
                        <NumberFormat
                          value={paidDistribution}
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator
                        />{" "}
                        {stcTokenSymbol}
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Stack
                    justifyContent="start"
                    direction="row"
                    alignItems="center"
                  >
                    <IconSpeed />
                    &nbsp;
                    <Tooltip arrow title="Relative Valuation after Payouts">
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
                    </Tooltip>
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
                    <Tooltip arrow title="Token Holders and Token Maximum">
                      <Typography>
                        {`${token.quantity}/${token.supply}`} (
                        <NumberFormat
                          value={occupationPercent}
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator
                        />{" "}
                        %)
                      </Typography>
                    </Tooltip>
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
