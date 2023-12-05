import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useRouter } from "next/router";
import { singleQueryArg } from "@/app/singleQueryArg";
import { UpdateAssetActionCard } from "./components/updateAssetActionCard";
import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";

const gridSpacing = Config.Layout.GridSpacing;

export const UpdateAsset = ({ aliasId }: { aliasId: string }) => {
  const { ledgerService } = useLedgerService();

  const { data, error } = useSWR(`assets/${aliasId}`, () =>
    ledgerService ? ledgerService?.asset.fetchAssetData(aliasId) : null
  );

  if (!data) return null;

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <UpdateAssetActionCard asset={data.getData()} aliasId={aliasId} />
      </Grid>
    </Grid>
  );
};
