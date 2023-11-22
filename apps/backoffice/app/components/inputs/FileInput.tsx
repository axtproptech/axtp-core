import { forwardRef, HTMLAttributes } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  useTheme,
} from "@mui/material";

const DefaultAccept = "image/*, application/pdf";
interface Props extends HTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  value?: string;
  hint?: string;
  accept?: string;
}

// eslint-disable-next-line react/display-name
export const FileInput = forwardRef((props: Props, ref) => {
  const theme = useTheme();
  const { accept = DefaultAccept, error, label, hint, ...args } = props;

  const hasError = Boolean(props.error);
  const hasHint = Boolean(props.hint);

  return (
    <FormControl
      fullWidth
      error={hasError}
      // @ts-ignore
      sx={{ ...theme.typography.customInput }}
    >
      <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
      {/*@ts-ignore*/}
      <OutlinedInput
        type="file"
        // @ts-ignore
        accept={accept}
        label={label}
        {...args}
        inputProps={{}}
        ref={ref}
      />
      {hasError && (
        <FormHelperText error id={props.id}>
          {error}
        </FormHelperText>
      )}
      {!hasError && hasHint && (
        <FormHelperText id={props.id}>{hint}</FormHelperText>
      )}
    </FormControl>
  );
});
