import { ChildrenProps } from "@/types/childrenProps";
import { FC } from "react";
import { styled } from "@mui/material/styles";

const Anchor = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.palette.primary.main,
}));

interface Props {
  href: string;
}

export const ExternalLink: FC<Props & ChildrenProps> = ({ href, children }) => (
  <Anchor href={href} rel="noreferrer noopener" target="_blank">
    {children}
  </Anchor>
);
