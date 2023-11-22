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
  const canEdit = onEditClick !== undefined;
  const editableSx = canEdit
    ? {
        cursor: "pointer",
        ":hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          borderRadius: 2,
        },
      }
    : {};

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{
        my: 1,
        overflowWrap: "anywhere",
        ...editableSx,
      }}
      onClick={canEdit ? onEditClick : undefined}
    >
      <Grid item>
        {canEdit ? (
          <Stack direction="row" alignItems="center">
            <EditIcon color="info" sx={{ fontSize: 12, mr: 0.25 }} />
            <Typography variant="caption" color="inherit">
              {label}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="caption" color="inherit">
            {label}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Body text={text}>{children}</Body>
      </Grid>
    </Grid>
  );
};
