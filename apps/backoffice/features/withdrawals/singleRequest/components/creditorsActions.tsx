import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconCircleCheck } from "@tabler/icons";
import { SingleWithdrawalRequest } from "@/features/withdrawals/singleRequest";

export type SingleRequestActionType = "confirm-payout";

interface Props {
  onAction: (action: SingleRequestActionType) => void;
  isExecuting: boolean;
}

export const SingleRequestActions = ({ onAction, isExecuting }: Props) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ ml: 2 }}>
        <ActionButton
          actionLabel="Confirm Payment"
          actionIcon={<IconCircleCheck />}
          color="success"
          onClick={() => onAction("confirm-payout")}
          isLoading={isExecuting}
        />
      </Box>
    </Box>
  );
};
