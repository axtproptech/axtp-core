import { FC, useState } from "react";
import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import {
  IconCashBanknoteOff,
  IconCirclePlus,
  IconDiscount2,
} from "@tabler/icons";

export type PaymentActionType =
  | "send-token"
  | "cancel-payment"
  | "register-transaction-id";

const DefaultAvailableActions = new Set<PaymentActionType>([
  "send-token",
  "register-transaction-id",
  "cancel-payment",
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
      {availableActions.has("register-transaction-id") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Register Transaction"
            actionIcon={<IconCirclePlus />}
            color="success"
            onClick={handleActionClick("register-transaction-id")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
      {availableActions.has("cancel-payment") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Cancel Payment"
            actionIcon={<IconCashBanknoteOff />}
            color="warning"
            onClick={handleActionClick("cancel-payment")}
            isLoading={actionsLoading}
            tooltip="Reimburse paid amount if customer is not eligible for token"
          />
        </Box>
      )}
    </Box>
  );
};
