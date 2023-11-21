import { FC, ReactNode } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

interface BodyProps {
  text?: string;
  children?: ReactNode;
}

const Body = ({ text, children }: BodyProps) => {
  return text !== undefined ? (
    <Typography variant="h5" color="inherit">
      {text}
    </Typography>
  ) : (
    <>children</>
  );
};

interface Props {
  label: string;
  text?: string;
  children?: ReactNode;
  onEditClick?: () => void;
}

export const LabeledTextField: FC<Props> = ({
  label,
  text,
  children,
  onEditClick,
}) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{ my: 1, overflowWrap: "anywhere" }}
    >
      <Grid item>
        <Typography variant="caption" color="inherit">
          {label}
        </Typography>
      </Grid>
      <Grid item>
        {onEditClick ? (
          <Stack
            direction="row"
            alignItems="center"
            onClick={onEditClick}
            sx={{
              cursor: "pointer",
              ":hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <IconButton size="small" color="inherit">
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Body text={text}>{children}</Body>
          </Stack>
        ) : (
          <Body text={text}>{children}</Body>
        )}
      </Grid>
    </Grid>
  );
};
