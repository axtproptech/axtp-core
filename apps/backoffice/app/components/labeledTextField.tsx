import { FC, ReactNode } from "react";
import { Grid, Typography } from "@mui/material";

interface Props {
  label: string;
  text?: string;
  children?: ReactNode;
}

export const LabeledTextField: FC<Props> = ({ label, text, children }) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{ my: 1 }}
    >
      <Grid item>
        <Typography variant="caption" color="inherit">
          {label}
        </Typography>
      </Grid>
      <Grid item>
        {text !== undefined ? (
          <Typography variant="h5" color="inherit">
            {text}
          </Typography>
        ) : (
          children
        )}
      </Grid>
    </Grid>
  );
};
