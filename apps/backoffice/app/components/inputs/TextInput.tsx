import { forwardRef, HTMLAttributes } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  useTheme,
} from "@mui/material";

interface Props extends HTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  value?: string;
}

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef((props: Props, ref) => {
  const theme = useTheme();
  const { error, label, ...args } = props;

  const hasError = Boolean(props.error);
  return (
    <FormControl
      fullWidth
      error={hasError}
      // @ts-ignore
      sx={{ ...theme.typography.customInput }}
    >
      <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
      {/*@ts-ignore*/}
      <OutlinedInput label={label} {...args} inputProps={{}} ref={ref} />
      {hasError && (
        <FormHelperText error id={props.id}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
});
