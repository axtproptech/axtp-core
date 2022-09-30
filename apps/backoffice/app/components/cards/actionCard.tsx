import { MainCard } from "@/app/components/cards";
import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import {
  ActionButton,
  ActionButtonProps,
} from "@/app/components/buttons/actionButton";

interface Props extends ActionButtonProps {
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: ReactNode;
  onClick: () => void;
  color?: any;
  disabled?: boolean;
  isLoading?: boolean;
}

const Action: FC<Props> = (props) => (
  <Box sx={{ display: "flex", flexDirection: "row" }}>
    <ActionButton {...props} />
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
