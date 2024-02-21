import { FC, useMemo } from "react";

import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import {
  Speed as IconSpeed,
  Payments as IconPayments,
  People as IconPeople,
  Undo,
} from "@mui/icons-material";
import { CardWrapperBlue } from "@/app/components/cards";
// @ts-ignore
import hashicon from "hashicon";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { PoolContractData } from "@/types/poolContractData";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import { Amount, ChainValue } from "@signumjs/util";
import { Config } from "@/app/config";
import { Number } from "@/app/components/number";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import {
  IconGrowth,
  IconRocket,
  IconRun,
  IconShieldLock,
  IconTargetArrow,
} from "@tabler/icons";

interface Props {
  data: PoolContractData;
  showContractBalance?: boolean;
}

export const PoolCard: FC<Props> = ({ data, showContractBalance = false }) => {
  const masterContract = useMasterContract();
  const masterTokenSymbol = masterContract.token.name;

  const {
    poolId,
    paidDistribution,
    pendingRefund,
    token,
    maxShareQuantity,
    nominalLiquidity,
    balance,
    masterToken,
    grossMarketValue,
    goal,
    isPublic,
    tokenRate,
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

  const supply = parseInt(token?.supply || "0");
  const performanceAbsolute = grossMarketValue - nominalLiquidity;
  const performancePercent = (grossMarketValue / nominalLiquidity) * 100 - 100;
  const goalPercent = (goal / nominalLiquidity) * 100;
  const occupationPercent = (supply / (maxShareQuantity || 0)) * 100;

  const goalReached = supply * tokenRate;
  const goalReachedPercent = Math.min(
    goal ? (goalReached / goal) * 100 : 0,
    100
  );

  const isBalanceLow = balanceAmount.less(
    Config.PoolContract.LowBalanceThreshold
  );

  return (
    <CardWrapperBlue border={false} content={false}>
      <Box sx={{ p: 2.25 }}>
        <Grid container>
          <Grid item style={{ width: "100%" }}>
            <Grid container justifyContent="space-between" alignItems="center">
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
              <Grid item>
                {!isPublic && (
                  <Tooltip arrow title="Private Offer">
                    <div>
                      <IconShieldLock />
                    </div>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Tooltip arrow title="See Contract in blockchain explorer">
                  <div>
                    <OpenExplorerButton id={poolId} type="address" label="" />
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <Grid container alignItems="center">
              <Grid item style={{ width: "100%" }}>
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
                  {pendingRefund > 0 && (
                    <Stack
                      justifyContent="start"
                      direction="row"
                      alignItems="baseline"
                    >
                      <Tooltip arrow title="Pending Refund">
                        <>
                          <Undo />
                          &nbsp;
                          <Typography>
                            <Number value={pendingRefund} />
                          </Typography>
                          <Typography>{masterTokenSymbol}</Typography>
                        </>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Tooltip arrow title="Valuation Initial X GMV">
                    <Stack
                      justifyContent="start"
                      direction="row"
                      alignItems="center"
                    >
                      <IconSpeed />
                      &nbsp;
                      <Typography
                        color={performancePercent < 0 ? "error" : "lightgreen"}
                        fontWeight="bold"
                      >
                        <Number value={performancePercent} suffix="%" />
                      </Typography>
                      &nbsp;
                      <Typography>
                        (
                        <Number
                          value={performanceAbsolute}
                          suffix={masterTokenSymbol}
                        />
                        )
                      </Typography>
                    </Stack>
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

                  {goal > 0 && (
                    <Stack
                      justifyContent="start"
                      direction="row"
                      alignItems="center"
                    >
                      <IconTargetArrow />
                      &nbsp;
                      <Tooltip arrow title="Crowdfunding Goal">
                        <Typography>
                          <Number
                            value={goal}
                            suffix={masterToken.name}
                            decimals={masterToken.decimals}
                          />
                          &nbsp;(
                          <Number value={goalPercent} decimals={2} suffix="%" />
                          )
                        </Typography>
                      </Tooltip>
                    </Stack>
                  )}

                  <Stack
                    justifyContent="start"
                    direction="row"
                    alignItems="center"
                  >
                    <IconRocket />
                    &nbsp;
                    <Tooltip arrow title="Current Gross Market Value">
                      <Typography>
                        <Number
                          value={grossMarketValue}
                          suffix={masterTokenSymbol}
                        />
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

                  {goal > 0 && (
                    <Stack
                      justifyContent="start"
                      direction="row"
                      alignItems="center"
                    >
                      {goalReachedPercent >= 100 ? (
                        <IconTargetArrow />
                      ) : (
                        <IconRun />
                      )}
                      &nbsp;
                      <Tooltip arrow title="Crowdfunding Goal Progress">
                        <Typography>
                          <Number
                            value={goalReached}
                            suffix={masterToken.name}
                            decimals={masterToken.decimals}
                          />
                          &nbsp;(
                          <Number
                            value={goalReachedPercent}
                            decimals={2}
                            suffix="%"
                          />
                          )
                        </Typography>
                      </Tooltip>
                    </Stack>
                  )}

                  <Stack
                    justifyContent="start"
                    direction="row"
                    alignItems="center"
                  >
                    <IconPeople />
                    &nbsp;
                    <Tooltip arrow title="Token Holders and Token Maximum">
                      <Typography>
                        {`${token.supply}/${maxShareQuantity}`} (
                        <Number
                          value={occupationPercent}
                          decimals={2}
                          suffix="%"
                        />
                        )
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
