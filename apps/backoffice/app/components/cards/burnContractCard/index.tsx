import { FC, memo, useMemo } from "react";

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

import {
  IconArrowBigDownLines,
  IconCash,
  IconFlame,
  IconReportMoney,
  IconSeeding,
  IconSend,
  IconSum,
} from "@tabler/icons";
import { CardWrapperDark } from "@/app/components/cards";
import { Number } from "@/app/components/number";
import { SkeletonBurnContractCard } from "./skeletonBurnContractCard";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { ExternalLink } from "@/app/components/links/externalLink";
import { Config } from "@/app/config";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { Amount, ChainValue } from "@signumjs/util";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PriceCheckRoundedIcon from "@mui/icons-material/PriceCheckRounded";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { CardWrapperBlack } from "../cardWrapperBlack";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import Link from "next/link";
import { TokenAccountCredits } from "@axtp/core";

interface TokenBalanceProps {
  tokenInfo: BasicTokenInfo;
}

const TokenBalance = ({ tokenInfo }: TokenBalanceProps) => {
  const amount = ChainValue.create(tokenInfo.decimals).setAtomic(
    tokenInfo.balance
  );

  return (
    <>
      <Stack direction="row" alignItems="baseline">
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 500,
            mt: 1.75,
            mb: 0.75,
            mr: 0.5,
          }}
        >
          <Number value={amount.getCompound()} />
        </Typography>
        <Typography>{tokenInfo.name.toUpperCase()}</Typography>
      </Stack>
    </>
  );
};

interface Props {
  tokenInfo: BasicTokenInfo;
  tokenAccountCredits: TokenAccountCredits[];
}

const WithdrawalToken = memo<Props>(({ tokenInfo, tokenAccountCredits }) => {
  const { pendingCount, pendingSum } = useMemo(() => {
    const ac = tokenAccountCredits.find(
      (tac) => tac.tokenId === tokenInfo.id
    )?.accountCredits;
    if (!ac) {
      return {
        pendingCount: 0,
        pendingSum: "0",
      };
    }

    const summedQuantity = ac.reduce(
      (acc, c) =>
        acc.add(
          ChainValue.create(tokenInfo.decimals).setAtomic(c.creditQuantity)
        ),
      ChainValue.create(tokenInfo.decimals)
    );

    return {
      pendingSum: summedQuantity.getCompound(),
      pendingCount: ac.length,
    };
  }, [tokenInfo, tokenAccountCredits]);

  return (
    <Box>
      <TokenBalance key={tokenInfo.id} tokenInfo={tokenInfo} />
      <Stack
        direction="row"
        alignItems="baseline"
        width="100%"
        justifyContent="space-between"
      >
        <Tooltip title="Pending Withdrawals">
          <Stack direction="row" alignItems="center">
            <IconArrowBigDownLines size="14" />
            <Typography>
              <Number value={pendingCount} decimals={0} />
            </Typography>
          </Stack>
        </Tooltip>
        <Tooltip title="Total Pending">
          <Stack direction="row" alignItems="center">
            <IconSum size="14" />
            <Typography>
              <Number
                value={pendingSum}
                decimals={tokenInfo.decimals}
                suffix={tokenInfo.name}
              />
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>
    </Box>
  );
});
WithdrawalToken.displayName = "WithdrawalToken";

export const BurnContractCard: FC = () => {
  const theme = useTheme();
  const { id, balanceSigna, trackableTokens, tokenAccountCredits, isLoading } =
    useBurnContract();

  const isBalanceLow = Amount.fromSigna(balanceSigna).less(
    Config.BurnContract.LowBalanceThreshold
  );

  return (
    <>
      {isLoading ? (
        <SkeletonBurnContractCard />
      ) : (
        <CardWrapperBlack border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Tooltip
                      arrow
                      title={
                        isBalanceLow
                          ? "Low Balance: Please recharge contract!"
                          : "Contract Balance is fine"
                      }
                    >
                      <Chip
                        label={`${balanceSigna} ${Config.Signum.TickerSymbol}`}
                        color={isBalanceLow ? "warning" : "default"}
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
                    <OpenExplorerButton id={id} type="at" label="" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Box>
                      {Object.values(trackableTokens).map((t) => (
                        <WithdrawalToken
                          key={t.id}
                          tokenInfo={t}
                          tokenAccountCredits={tokenAccountCredits}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    // @ts-ignore
                    color: theme.palette.grey[700],
                  }}
                >
                  Withdrawn and Burnt Tokens
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapperBlack>
      )}
    </>
  );
};
