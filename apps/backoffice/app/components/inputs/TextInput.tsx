import { FC, HtmlHTMLAttributes } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  useTheme,
} from "@mui/material";

interface Props extends HtmlHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export const TextInput: FC<Props> = (props) => {
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
      <OutlinedInput label={label} {...args} inputProps={{}} />
      {hasError && (
        <FormHelperText error id={props.id}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};
