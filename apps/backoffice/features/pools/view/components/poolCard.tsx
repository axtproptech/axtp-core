import { FC, useMemo } from "react";

import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import {
  Speed as IconSpeed,
  Payments as IconPayments,
  People as IconPeople,
} from "@mui/icons-material";
import { CardWrapperBlue } from "@/app/components/cards";
import { NumericFormat } from "react-number-format";
// @ts-ignore
import hashicon from "hashicon";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { PoolContractData } from "@/types/poolContractData";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import { Amount } from "@signumjs/util";
import { Config } from "@/app/config";
import { Number } from "@/app/components/number";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { IconGrowth, IconRocket } from "@tabler/icons";

interface Props {
  data: PoolContractData;
  showContractBalance?: boolean;
}

// FIXME: add pending/accumulated payout liquidity

export const PoolCard: FC<Props> = ({ data, showContractBalance = false }) => {
  const masterContract = useMasterContract();
  const masterTokenSymbol = masterContract.token.name;

  const {
    poolId,
    paidDistribution,
    token,
    nominalLiquidity,
    balance,
    masterToken,
    grossMarketValue,
  } = data;

  const iconUrl = useMemo(() => {
    if (!poolId) return "";
    return hashicon(poolId, { size: 32 }).toDataURL();
  }, [poolId]);

  const balanceAmount = useMemo(() => {
    try {
      return Amount.fromSigna(balance);
    } catch (e) {
      return Amount.Zero();
    }
  }, [balance]);

  const performancePercent =
    ((nominalLiquidity + paidDistribution) / nominalLiquidity) * 100;
  const occupationPercent =
    (parseInt(token?.balance || "0") / parseInt(token?.supply || "0")) * 100;

  const isBalanceLow = balanceAmount.less(
    Config.PoolContract.LowBalanceThreshold
  );

  return (
    <CardWrapperBlue border={false} content={false}>
      <Box sx={{ p: 2.25 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Tooltip
                  arrow
                  title="Pool Token - Click to open in blockchain explorer "
                >
                  <Chip
                    sx={{ mr: 2 }}
                    label={token.name.toUpperCase()}
                    color="primary"
                    href={`${Config.Signum.Explorer}asset/${token.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    component={"a"}
                    avatar={
                      <img
                        src={iconUrl}
                        alt={poolId}
                        style={{ backgroundColor: "transparent" }}
                      />
                    }
                  />
                </Tooltip>
                {(showContractBalance || isBalanceLow) && (
                  <Tooltip
                    arrow
                    title={
                      isBalanceLow
                        ? "Low Balance: Please recharge contract!"
                        : "Contract Balance is fine"
                    }
                  >
                    <Chip
                      label={`${balance} ${Config.Signum.TickerSymbol}`}
                      color={isBalanceLow ? "warning" : "primary"}
                      avatar={
                        isBalanceLow ? (
                          <WarningAmberRoundedIcon color="warning" />
                        ) : (
                          <PriceCheckRoundedIcon color="success" />
                        )
                      }
                    />
                  </Tooltip>
                )}
              </Grid>
              <Grid item sx={{ zIndex: 1000 }}>
                <Tooltip arrow title="See Contract in blockchain explorer">
                  <div>
                    <OpenExplorerButton id={poolId} type={"at"} label="" />
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="baseline">
                  <Tooltip arrow title="Current Balance">
                    <Typography
                      sx={{
                        fontSize: "2.125rem",
                        fontWeight: 500,
                        mt: 1.75,
                        mb: 0.75,
                      }}
                    >
                      <Number value={masterToken.balance} />
                    </Typography>
                  </Tooltip>
                  <Typography>{masterTokenSymbol}</Typography>
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
                    <IconGrowth />
                    &nbsp;
                    <Tooltip arrow title="Initial Nominal Liquidity">
                      <Typography>
                        <Number
                          value={nominalLiquidity}
                          suffix={masterTokenSymbol}
                        />
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Stack
                    justifyContent="start"
                    direction="row"
                    alignItems="center"
                  >
                    <IconRocket />
                    &nbsp;
                    <Tooltip arrow title="Gross Market Value">
                      <Typography>
                        <Number
                          value={grossMarketValue}
                          suffix={masterTokenSymbol}
                        />
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
                        <Number value={performancePercent} suffix="%" />
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
                    <IconPayments />
                    &nbsp;
                    <Tooltip arrow title="Paid Distribution">
                      <Typography>
                        <Number
                          value={paidDistribution}
                          suffix={masterTokenSymbol}
                        />
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Stack
                    justifyContent="start"
                    direction="row"
                    alignItems="center"
                  >
                    <IconPeople />
                    &nbsp;
                    <Tooltip arrow title="Token Holders and Token Maximum">
                      <Typography>
                        {`${token.balance}/${token.supply}`} (
                        <NumericFormat
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
