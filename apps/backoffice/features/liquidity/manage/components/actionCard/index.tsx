import { MainCard } from "@/app/components/cards";
import { Box, Button, Color, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";

interface Props {
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: ReactNode;
  onClick: () => void;
  color?: any;
}

const Action: FC<Props> = ({
  actionLabel,
  actionIcon,
  color = "primary",
  onClick,
}) => (
  <Box sx={{ display: "flex", flexDirection: "row" }}>
    <Button variant="contained" color={color} onClick={onClick}>
      {actionIcon}&nbsp;{actionLabel}
    </Button>
  </Box>
);

export const ActionCard: FC<Props & ChildrenProps> = (props) => {
  const { title, description, children } = props;
  return (
    <MainCard title={title} actions={<Action {...props} />}>
      <Typography variant="subtitle2">{description}</Typography>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </MainCard>
  );
};
