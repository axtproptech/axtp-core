import { forwardRef, HTMLAttributes } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  useTheme,
  Select,
} from "@mui/material";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface Props extends HTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  value?: string;
  options: SelectOption[];
}

// eslint-disable-next-line react/display-name
export const SelectInput = forwardRef((props: Props, ref) => {
  const theme = useTheme();
  const { error, label, options, ...args } = props;

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
      <Select label={label} {...args} inputProps={{}} ref={ref}>
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
      {hasError && (
        <FormHelperText error id={props.id}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
});
