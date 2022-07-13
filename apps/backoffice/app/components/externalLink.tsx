import { ChildrenProps } from "@/types/ChildrenProps";
import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";

const Anchor = styled("a")(({ theme }) => ({
  textDecoration: "underline",
}));

interface Props {
  href: string;
}

export const ExternalLink: FC<Props & ChildrenProps> = ({ href, children }) => (
  <Anchor href={href} rel="noreferrer noopener" target="_self">
    {children}
  </Anchor>
);
