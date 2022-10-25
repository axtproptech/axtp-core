import { FC } from "react";
import { TokenHolderTable } from "@/features/pools/view/components/tokenHolderTable";

interface Props {
  poolId: string;
}

export const ShowTokenHolders: FC<Props> = ({ poolId }) => {
  return <TokenHolderTable poolId={poolId} />;
};
