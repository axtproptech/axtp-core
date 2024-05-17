import { FormEvent, useEffect, useLayoutEffect, useState } from "react";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { SelectInput, SelectOption } from "@/app/components/inputs";
import { styled } from "@mui/material/styles";

export const InlineWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

interface Props {
  label: string;
  initialValue: string;
  options: SelectOption[];
  name: string;
  onSubmit: (name: string, value: string) => void;
}

function findSelection(options: SelectOption[], value: string): SelectOption {
  const found = options.find((option) => option.value === value);
  return found ?? options[0];
}

export const EditableSelectField = ({
  label,
  initialValue,
  name,
  options,
  onSubmit,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(null);

  useLayoutEffect(() => {
    if (initialValue && options.length) {
      setSelected(findSelection(options, initialValue));
    }
  }, [initialValue, options]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (initialValue && options.length) {
      setSelected(findSelection(options, initialValue));
    }
    setIsEditing(false);
  };

  const onFieldSubmit = () => {
    if (selected) {
      onSubmit(name, selected.value.toString());
    }
    setIsEditing(false);
  };

  const handleOnChange = (e: any) => {
    setSelected(findSelection(options, e.target.value));
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
            <InlineWrapper>
              <SelectInput
                name={name}
                label={label}
                // @ts-ignore
                value={selected ? selected.value : options[0].value}
                options={options}
                onChange={handleOnChange}
              />
              <InlineWrapper>
                <IconButton type="submit">
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={handleCancelClick}>
                  <CloseIcon />
                </IconButton>
              </InlineWrapper>
            </InlineWrapper>
          </form>
        ) : (
          <LabeledTextField
            label={label}
            text={selected?.label || ""}
            onEditClick={handleEditClick}
          />
        )}
      </Grid>
    </Grid>
  );
};
