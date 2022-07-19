import { Typography } from "@mui/material";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { FC } from "react";

interface Props {
  transactionId: string;
}
export const SucceededTransactionSection: FC<Props> = ({ transactionId }) => {
  return transactionId ? (
    <>
      <Typography variant="subtitle2">
        The transaction was successfully broadcast to the network. It takes
        about four minutes until it takes effect. You can trace the transaction
        in the networks explorer.
      </Typography>
      <OpenExplorerButton id={transactionId} type="tx" />
    </>
  ) : null;
};
