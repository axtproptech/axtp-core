import { FC } from "react";
import { AssetAliasService } from "@axtp/core";
import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
interface Props {
  poolId: string;
}

export const ShowAssets: FC<Props> = ({ poolId }) => {
  useLedgerService();

  return <h2>Assets</h2>;
};
