import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import {
  DesktopDatePicker as DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid } from "date-fns";
import { Check as CheckIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
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
  const { register, handleSubmit, control } = useForm();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const onFieldSubmit = (data: any) => {
    onSubmit(name, data);
    setIsEditing(false);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{ my: 1, overflowWrap: "anywhere" }}
    >
      <Grid item>
        {isEditing ? (
          <form
            style={{ padding: "16px 0" }}
            onSubmit={handleSubmit(onFieldSubmit)}
          >
            {initialValue instanceof Date ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name={name}
                  control={control}
                  defaultValue={initialValue}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        isValid(date) && setValue(format(date, `dd/MM/yyyy`));
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
                  )}
                />
              </LocalizationProvider>
            ) : (
              <TextField
                {...register(name)}
                defaultValue={value}
                label={label}
                fullWidth
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
