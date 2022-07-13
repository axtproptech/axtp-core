import { FC } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { Box, Container, Paper } from "@mui/material";

export const AuthLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <Container>
      <Paper elevation={3}>{children}</Paper>
    </Container>
  );
};
