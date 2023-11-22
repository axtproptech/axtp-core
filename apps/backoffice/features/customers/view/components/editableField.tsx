import { useState } from "react";
import { Grid, InputAdornment, TextField } from "@mui/material";
import {
  DesktopDatePicker as DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid } from "date-fns";
import { Check as CheckIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { LabeledTextField } from "@/app/components/labeledTextField";

interface Props {
  label: string;
  initialValue: string | Date;
  name: string;
  onSubmit: (name: string, value: string) => void;
}

export const EditableField = ({
  label,
  initialValue,
  name,
  onSubmit,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const onFieldSubmit = () => {
    onSubmit(name, value.toString());
    setIsEditing(false);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{ overflowWrap: "anywhere" }}
    >
      <Grid item>
        {isEditing ? (
          <form
            style={{ padding: "16px 0", width: "auto" }}
            onSubmit={onFieldSubmit}
          >
            {initialValue instanceof Date ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={value}
                  onChange={(date) => {
                    isValid(date) && setValue(date!);
                  }}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={label}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton type="submit">
                              <CheckIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelClick}>
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            ) : (
              <TextField
                label={label}
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit">
                        <CheckIcon />
                      </IconButton>
                      <IconButton onClick={handleCancelClick}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </form>
        ) : (
          <LabeledTextField
            label={label}
            text={value instanceof Date ? format(value, `dd/MM/yyyy`) : value}
            onEditClick={handleEditClick}
          />
        )}
      </Grid>
    </Grid>
  );
};
