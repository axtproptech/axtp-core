import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useMemo } from "react";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  accountId: string;
  tokenId: string;
}

export const SingleWithdrawalRequest = ({ accountId, tokenId }: Props) => {
  const { tokenAccountCredits } = useBurnContract();

  const found = useMemo(() => {
    const tac = tokenAccountCredits.find((t) => t.tokenInfo.id === tokenId);
    if (tac) {
      return tac.accountCredits.find((ac) => ac.accountId === accountId);
    }
    return null;
  }, [tokenAccountCredits]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <p>{tokenId}</p>
        <p>{accountId}</p>
      </Grid>
    </Grid>
  );
};
