import { FC, useState } from "react";
import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconDiscount2 } from "@tabler/icons";

export type PaymentActionType =
  | "send-token"
  | "set-processed"
  | "set-cancelled";

const DefaultAvailableActions = new Set<PaymentActionType>([
  "send-token",
  "set-processed",
  "set-cancelled",
]);

interface Props {
  onAction: (action: PaymentActionType) => Promise<void>;
  availableActions?: Set<PaymentActionType>;
}

export const PaymentActions: FC<Props> = ({
  onAction,
  availableActions = DefaultAvailableActions,
}) => {
  const [actionsLoading, setActionsLoading] = useState(false);

  const handleActionClick = (action: PaymentActionType) => async () => {
    setActionsLoading(true);
    await onAction(action);
    setActionsLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      {availableActions.has("send-token") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Send Token"
            actionIcon={<IconDiscount2 />}
            color="success"
            onClick={handleActionClick("send-token")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
    </Box>
  );
};
