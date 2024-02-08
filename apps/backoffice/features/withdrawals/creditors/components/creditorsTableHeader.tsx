import { Box, Stack, Typography } from "@mui/material";
import { CreditorsActions, CreditorsActionType } from "./creditorsActions";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";

interface Props {
  onAction: (action: CreditorsActionType) => void;
  isExecuting: boolean;
  transactionId: string;
}
export const CreditorsTableHeader = ({
  onAction,
  isExecuting,
  transactionId,
}: Props) => {
  return (
    <Stack direction="column">
      <Stack direction="row" alignItems="start">
        <Box flex={1}>
          <Typography variant="h3">Creditors</Typography>
          <Typography variant="caption">
            Creditors are accounts who are permitted to register payouts for
            requested withdrawals.
          </Typography>
        </Box>
        <Box>
          <CreditorsActions isExecuting={isExecuting} onAction={onAction} />
        </Box>
      </Stack>
      <SucceededTransactionSection transactionId={transactionId} />
    </Stack>
  );
};
