import { AssetAliasData } from "@axtp/core";
import { Button, Stack, Typography } from "@mui/material";
import { Number } from "@/app/components/number";
import { useMemo } from "react";
import { IconShoppingCartPlus } from "@tabler/icons";
import Link from "next/link";

interface Props {
  assets: AssetAliasData[];
  poolId: string;
}

export const AssetTableTitle = ({ assets, poolId }: Props) => {
  const performance = useMemo(() => {
    const { totalCosts, totalMarketValue } = assets.reduce(
      (acc, c) => {
        acc.totalCosts += c.accumulatedCosts;
        acc.totalMarketValue += c.estimatedMarketValue;
        return acc;
      },
      {
        totalMarketValue: 0,
        totalCosts: 0,
      }
    );
    return {
      totalCosts,
      totalMarketValue,
      performance: totalCosts ? (totalMarketValue / totalCosts) * 100 : 0,
      gain: totalMarketValue - totalCosts,
    };
  }, [assets]);

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="column" gap={0.5}>
        <Stack direction="row" gap={1} alignItems="baseline">
          <Typography variant="h3">Assets</Typography>
          <Typography variant="h4">
            Potential Gain:&nbsp;
            <Number value={performance.gain} suffix="USD" />
          </Typography>
          <Typography variant="h4">
            Performance:&nbsp;
            <Number value={performance.performance} suffix="%" />
          </Typography>
        </Stack>
        <Stack direction="row" gap={1} alignItems="baseline">
          <Typography variant="caption">
            Total Market Value&nbsp;
            <Number value={performance.totalMarketValue} suffix="USD" />
          </Typography>
          <Typography variant="caption">
            Total Accumulated Costs&nbsp;
            <Number value={performance.totalCosts} suffix="USD" />
          </Typography>
        </Stack>
      </Stack>

      <Link href={`/admin/pools/${poolId}/assets/new`}>
        <Button variant="contained" color="info">
          <IconShoppingCartPlus />
          Add New Asset
        </Button>
      </Link>
    </Stack>
  );
};
