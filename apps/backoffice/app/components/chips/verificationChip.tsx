import { Chip, Tooltip } from "@mui/material";

const VerificationColors = {
  Level1: "success",
  Level2: "info",
  Pending: "warning",
  NotVerified: "",
};

type VerificationLevel = "Level1" | "Level2" | "Pending" | "NotVerified";

interface Props {
  level: string | VerificationLevel;
}

export const VerificationChip = ({ level }: Props) => {
  if (!level) return null;
  // @ts-ignore
  const color = VerificationColors[level];
  return (
    <Tooltip title="Verification Status">
      <Chip label={level} color={color} />
    </Tooltip>
  );
};
