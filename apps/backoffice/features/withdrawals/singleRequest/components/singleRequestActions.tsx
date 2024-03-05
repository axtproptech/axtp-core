import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconCashOff, IconCircleCheck, IconUserSearch } from "@tabler/icons";
import { CustomerResponse } from "@/bff/types/customerResponse";

export type SingleRequestActionType =
  | "confirm-payout"
  | "deny-payout"
  | "view-customer";

interface Props {
  onAction: (action: SingleRequestActionType) => void;
  isExecuting: boolean;
  customer?: CustomerResponse;
}

export const SingleRequestActions = ({
  onAction,
  isExecuting,
  customer,
}: Props) => {
  const confirmPayoutDisabled = !(
    customer &&
    !customer.isBlocked &&
    customer.isActive
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ ml: 2 }}>
        <ActionButton
          actionLabel="Confirm Payment"
          actionIcon={<IconCircleCheck />}
          disabled={confirmPayoutDisabled}
          color="success"
          onClick={() => onAction("confirm-payout")}
          isLoading={isExecuting}
        />
      </Box>
      <Box sx={{ ml: 2 }}>
        <ActionButton
          actionLabel="Deny Payment"
          actionIcon={<IconCashOff />}
          color="error"
          onClick={() => onAction("deny-payout")}
          isLoading={isExecuting}
        />
      </Box>
      <Box sx={{ ml: 2 }}>
        <ActionButton
          actionLabel="View Customer"
          actionIcon={<IconUserSearch />}
          color="info"
          onClick={() => onAction("view-customer")}
        />
      </Box>
    </Box>
  );
};
