import { useState } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { LabeledTextField } from "@/app/components/labeledTextField";

export interface Name {
  firstName: string;
  lastName: string;
}
interface Props {
  label: string;
  name: Name;
  onSubmit: (name: Name) => void;
}

export const EditableFirstNameLastName = ({ label, name, onSubmit }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(name.firstName);
  const [lastName, setLastName] = useState(name.lastName);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setFirstName(name.firstName);
    setLastName(name.lastName);
    setIsEditing(false);
  };

  const onNameSubmit = () => {
    onSubmit({ firstName, lastName });
    setIsEditing(false);
  };

  const canSave =
    firstName.length &&
    lastName.length &&
    (firstName.toUpperCase() !== name.firstName.toUpperCase() ||
      lastName.toUpperCase() !== name.lastName.toUpperCase());

  return (
    <Grid container spacing={1} direction="row" alignItems="center">
      {isEditing ? (
        <>
          <Grid item>
            <TextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              label="First Name"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <TextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              label="Last Name"
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={onNameSubmit}
                disabled={!canSave}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="cancel">
              <IconButton onClick={handleCancelClick}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </>
      ) : (
        <>
          <Grid item>
            <LabeledTextField label={label} text={`${firstName} ${lastName}`} />
          </Grid>
          <Grid item>
            <Tooltip title="Edit Name">
              <IconButton size="small" onClick={handleEditClick}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </>
      )}
    </Grid>
  );
};
