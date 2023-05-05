import { FC, useState } from "react";
import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import {
  IconBarrierBlock,
  IconBarrierBlockOff,
  IconShieldCheck,
  IconUser,
  IconUserCheck,
  IconUserExclamation,
  IconUserOff,
  IconUserX,
  IconMailForward,
} from "@tabler/icons";

export type CustomerActionType =
  | "verify"
  | "invite"
  | "block"
  | "unblock"
  | "deactivate"
  | "activate";

const DefaultAvailableActions = new Set<CustomerActionType>([
  "verify",
  "block",
  "deactivate",
]);

interface Props {
  onAction: (action: CustomerActionType) => Promise<void>;
  availableActions?: Set<CustomerActionType>;
}

export const CustomerActions: FC<Props> = ({
  onAction,
  availableActions = DefaultAvailableActions,
}) => {
  const [actionsLoading, setActionsLoading] = useState(false);

  const handleActionClick = (action: CustomerActionType) => async () => {
    setActionsLoading(true);
    await onAction(action);
    setActionsLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      {availableActions.has("verify") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Verify"
            actionIcon={<IconUserCheck />}
            color="success"
            onClick={handleActionClick("verify")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
      {availableActions.has("invite") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Invite"
            actionIcon={<IconMailForward />}
            color="info"
            onClick={handleActionClick("invite")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
      {availableActions.has("block") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Block"
            actionIcon={<IconUserX />}
            color="error"
            onClick={handleActionClick("block")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
      {availableActions.has("unblock") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Unblock"
            actionIcon={<IconUser />}
            color="warning"
            onClick={handleActionClick("unblock")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
      {availableActions.has("deactivate") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Deactivate"
            actionIcon={<IconUserOff />}
            color="error"
            onClick={handleActionClick("deactivate")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
      {availableActions.has("activate") && (
        <Box sx={{ ml: 2 }}>
          <ActionButton
            actionLabel="Activate"
            actionIcon={<IconUser />}
            color="warning"
            onClick={handleActionClick("deactivate")}
            isLoading={actionsLoading}
          />
        </Box>
      )}
    </Box>
  );
};
