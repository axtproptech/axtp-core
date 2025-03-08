import { forwardRef, HTMLAttributes, ReactElement, ReactNode } from "react";

import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

interface Props {
  border?: boolean;
  boxShadow?: boolean;
  children: ReactNode;
  actions?: ReactNode;
  actionsOnTop?: boolean;
  content?: boolean;
  contentClass?: string;
  contentSX?: object;
  darkTitle?: boolean;
  secondary?: ReactElement;
  shadow?: string;
  sx?: any;
  title?: ReactElement | string;
  elevation?: number;
}

// eslint-disable-next-line react/display-name
export const MainCard = forwardRef<any, Props>(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      actions,
      actionsOnTop = false,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? "1px solid" : "none",
          borderColor: theme.palette.primary.light + 75,
          ":hover": {
            boxShadow: boxShadow
              ? shadow || "0 2px 14px 0 rgb(32 40 45 / 8%)"
              : "inherit",
          },
          ...sx,
        }}
      >
        {actions && actionsOnTop && (
          <>
            <CardActions>{actions}</CardActions>
            <Divider />
          </>
        )}
        {!darkTitle && title && (
          <CardHeader sx={headerSX} title={title} action={secondary} />
        )}
        {darkTitle && title && (
          <CardHeader
            sx={headerSX}
            title={<Typography variant="h3">{title}</Typography>}
            action={secondary}
          />
        )}

        {title && <Divider />}

        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
        {actions && !actionsOnTop && <CardActions>{actions}</CardActions>}
      </Card>
    );
  }
);
