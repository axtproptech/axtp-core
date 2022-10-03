import { Chip, Tooltip } from "@mui/material";

interface Props {
  isBlocked: boolean;
  alwaysShow?: boolean;
}

export const BlockingChip = ({ isBlocked, alwaysShow = false }: Props) => {
  if (!isBlocked && !alwaysShow) return null;

  // @ts-ignore
  return (
    <Tooltip title="Blocking Status">
      <Chip
        label={isBlocked ? "Blocked" : "Unblocked"}
        color={isBlocked ? "error" : "success"}
      />
    </Tooltip>
  );
};
