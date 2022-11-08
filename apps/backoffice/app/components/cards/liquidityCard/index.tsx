import { FC, useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { IconCash, IconFlame, IconSeeding, IconSend } from "@tabler/icons";
import { CardWrapperDark } from "@/app/components/cards";
import { Number } from "@/app/components/number";
import { SkeletonLiquidityCard } from "./skeletonLiquidityCard";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { ExternalLink } from "@/app/components/links/externalLink";
import { Config } from "@/app/config";
import { useMasterContract } from "@/app/hooks/useMasterContract";
// @ts-ignore
import hashicon from "hashicon";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { Amount } from "@signumjs/util";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";

interface Props {
  isLoading?: boolean;
}

export const LiquidityCard: FC<Props> = ({ isLoading = false }) => {
  const theme = useTheme();
  const {
    id,
    approvalStatusMinting,
    approvalStatusBurning,
    approvalStatusSendToPool,
    token,
    currentSendPoolAddress,
    balance,
  } = useMasterContract();

  const sendPool = useAppSelector(
    selectPoolContractState(currentSendPoolAddress)
  );

  const balanceAmount = useMemo(() => {
    try {
      return Amount.fromSigna(balance);
    } catch (e) {
      return Amount.Zero();
    }
  }, [balance]);

  const iconUrl = useMemo(() => {
    if (!token.id) return "";
    return hashicon(token.id, { size: 32 }).toDataURL();
  }, [token.id]);

  const isBalanceLow = balanceAmount.less(
    Config.MasterContract.LowBalanceThreshold
  );

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
                    <Tooltip
                      arrow
                      title="AXTC Token - Click to open in blockchain explorer "
                    >
                      <Chip
                        sx={{ mr: 2 }}
                        label={token.name.toUpperCase()}
                        color="secondary"
                        href={`${Config.Signum.Explorer}asset/${token.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        clickable
                        component={"a"}
                        avatar={
                          <img
                            src={iconUrl}
                            alt={token.id}
                            style={{ backgroundColor: "transparent" }}
                          />
                        }
                      />
                    </Tooltip>
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
                        color={isBalanceLow ? "warning" : "secondary"}
                        avatar={
                          isBalanceLow ? (
                            <WarningAmberRoundedIcon color="warning" />
                          ) : (
                            <PriceCheckRoundedIcon color="success" />
                          )
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item sx={{ zIndex: 1000 }}>
                    <OpenExplorerButton id={id} type="address" label="" />
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
                        <Number value={token.balance} />
                      </Typography>
                      <Typography>{token.name.toUpperCase()}</Typography>
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
                        <Typography>
                          <Number value={approvalStatusMinting.quantity} />
                        </Typography>
                      </Stack>
                      <Tooltip
                        title={
                          sendPool
                            ? `Sending to Pool ${sendPool.token.name}`
                            : "No Pool Sending pending"
                        }
                      >
                        <Stack
                          justifyContent="start"
                          direction="row"
                          alignItems="center"
                        >
                          <IconSend />
                          &nbsp;
                          <Typography>
                            <Number value={approvalStatusSendToPool.quantity} />
                          </Typography>
                        </Stack>
                      </Tooltip>
                      <Stack
                        justifyContent="start"
                        direction="row"
                        alignItems="center"
                      >
                        <IconFlame />
                        &nbsp;
                        <Typography>
                          <Number
                            value={`-${approvalStatusBurning.quantity}`}
                          />
                        </Typography>
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
