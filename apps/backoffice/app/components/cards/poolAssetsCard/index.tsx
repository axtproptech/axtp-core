import { FC, useMemo } from "react";

import {
  Box,
  Chip,
  Grid,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Speed as IconSpeed,
  Payments as IconPayments,
  People as IconPeople,
  Undo,
} from "@mui/icons-material";
// @ts-ignore
import hashicon from "hashicon";
import { Config } from "@/app/config";
import { Number } from "@/app/components/number";
import {
  IconBuildingCommunity,
  IconBusinessplan,
  IconCashOff,
  IconCertificate,
  IconCertificate2,
  IconCertificateOff,
  IconHomePlus,
  IconQuestionMark,
  IconReceipt2,
  IconTrendingUp,
  TablerIcon,
} from "@tabler/icons";
import { usePoolAssets } from "@/app/hooks/usePoolAssets";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import { CardWrapperGold } from "@/app/components/cards/cardWrapperGold";
import { ChildrenProps } from "@/types/childrenProps";

interface Props {
  poolId: string;
}

export const PoolAssetsCard: FC<Props> = ({ poolId }) => {
  const { assets, isLoading } = usePoolAssets(poolId);
  const { token } = usePoolContract(poolId);

  const iconUrl = useMemo(() => {
    if (!poolId) return "";
    return hashicon(poolId, { size: 32 }).toDataURL();
  }, [poolId]);

  const data = useMemo(() => {
    const assetAliasData = Array.from(assets?.values() ?? []).map((aliases) =>
      aliases.getData()
    );

    const { totalCosts, totalMarketValue, progressMap } = assetAliasData.reduce(
      (acc, c) => {
        acc.totalCosts += c.accumulatedCosts;
        acc.totalMarketValue += c.estimatedMarketValue;

        // @ts-ignore
        const count = acc.progressMap[c.acquisitionProgress] ?? 0;
        // @ts-ignore
        acc.progressMap[c.acquisitionProgress] = count + 1;

        return acc;
      },
      {
        totalMarketValue: 0,
        totalCosts: 0,
        progressMap: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
      }
    );
    return {
      count: assetAliasData.length,
      totalCosts,
      totalMarketValue,
      performance: (totalMarketValue / totalCosts) * 100,
      gain: totalMarketValue - totalCosts,
      progressMap,
    };
  }, [assets]);

  // const isLoading = true;

  // @ts-ignore
  return (
    <CardWrapperGold border={false} content={false}>
      <Stack sx={{ p: 2.25 }}>
        <Grid container>
          <Grid item style={{ width: "100%" }}>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Tooltip
                  arrow
                  title="Pool Token - Click to open in blockchain explorer "
                >
                  <Chip
                    sx={{ mr: 2 }}
                    label={token.name.toUpperCase()}
                    color="default"
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
              </Grid>
              <Grid item>
                <Tooltip title="Number of Assets">
                  <Stack direction="row" alignItems="center">
                    <IconBuildingCommunity />
                    <Loadable loading={isLoading} width={24}>
                      <Typography variant="h3" sx={{ ml: 0.5, color: "white" }}>
                        {data.count}
                      </Typography>
                    </Loadable>
                  </Stack>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <Grid container alignItems="center">
              <Grid item style={{ width: "100%" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="baseline"
                >
                  <Tooltip arrow title="Total Potential Gain">
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <Loadable
                        loading={isLoading}
                        width={120}
                        height={32}
                        sx={{ mt: 1, mb: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "2.125rem",
                            fontWeight: 500,
                            mt: 1.75,
                            mb: 0.75,
                          }}
                        >
                          <Number value={data.gain} />
                        </Typography>
                      </Loadable>
                      <Typography>USD</Typography>
                    </Stack>
                  </Tooltip>
                  <Tooltip arrow title="Total Performance">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconTrendingUp />
                      <Loadable loading={isLoading} width={120} height={24}>
                        <Typography variant="h2" color="white">
                          <Number value={data.performance} suffix="%" />
                        </Typography>
                      </Loadable>
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
                  <Tooltip arrow title="Total Market Value">
                    <Stack
                      justifyContent="start"
                      direction="row"
                      alignItems="center"
                    >
                      <IconBusinessplan />
                      &nbsp;
                      <Loadable loading={isLoading}>
                        <Typography fontWeight="bold">
                          <Number value={data.totalMarketValue} suffix="USD" />
                        </Typography>
                      </Loadable>
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
                    <IconCashOff />
                    &nbsp;
                    <Loadable loading={isLoading}>
                      <Tooltip arrow title="Total Accumulated Costs">
                        <Typography>
                          <Number value={data.totalCosts} suffix="USD" />
                        </Typography>
                      </Tooltip>
                    </Loadable>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  {Object.entries(data.progressMap).map(([progress, count]) => (
                    <ProgressCountItem
                      key={progress}
                      progress={progress}
                      count={count}
                      loading={isLoading}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </CardWrapperGold>
  );
};

interface ItemProps {
  progress: number | string;
  count: number;
  loading: boolean;
}

interface StatusObject {
  text: string;
  icon: TablerIcon;
}

const AcquisitionProgress: Record<number, StatusObject> = {
  0: { text: "Paid", icon: IconReceipt2 },
  1: { text: "Cert. Received", icon: IconCertificate },
  2: { text: "Notified", icon: IconCertificate2 },
  3: { text: "Acquired", icon: IconHomePlus },
  4: { text: "Recovered", icon: IconCertificateOff },
};
const ProgressCountItem = ({ progress, count, loading }: ItemProps) => {
  // @ts-ignore
  const status = AcquisitionProgress[progress] ?? {
    text: "Unknown",
    icon: IconQuestionMark,
  };

  return (
    <Tooltip arrow title={status.text}>
      <Stack
        justifyContent="start"
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <status.icon />
        <Loadable loading={loading} variant="circular" width={20} height={20}>
          <Typography>
            <Number value={count} decimals={0} />
          </Typography>
        </Loadable>
      </Stack>
    </Tooltip>
  );
};

interface LoadableProps extends ChildrenProps {
  loading: boolean;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  variant?: "rounded" | "circular";
}

const Loadable: FC<LoadableProps> = ({
  loading,
  children,
  height = 24,
  width = 100,
  sx = {},
  variant = "rounded",
}) => {
  return loading ? (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      sx={{
        backgroundColor: "rgba(255,255,255, 0.5)",
        ...sx,
      }}
    />
  ) : (
    <>{children}</>
  );
};
