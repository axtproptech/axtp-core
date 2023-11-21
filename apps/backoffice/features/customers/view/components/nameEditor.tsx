import { useState } from "react";
import { Grid, TextField, Tooltip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Check as CheckIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { customerService } from "@/app/services/customerService/customerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";

interface Props {
  customer: CustomerFullResponse;
}

export const EditableName = ({ customer }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(customer.firstName);
  const [lastName, setLastName] = useState(customer.lastName);

  const { showError } = useSnackbar();
  const handleSave = async () => {
    if (!firstName || !lastName) {
      showError("Name cannot be empty");
      return;
    }

    try {
      await customerService.with(customer.cuid).updateCustomer({
        firstName,
        lastName,
      });
    } catch (e: any) {
      console.error(e);
      showError("Updating name failed!");
    } finally {
      setIsEditing(false);
    }
  };

  const canSave =
    firstName.length &&
    lastName.length &&
    (firstName.toUpperCase() !== customer.firstName.toUpperCase() ||
      lastName.toUpperCase() !== customer.lastName.toUpperCase());
  const handleCancelClick = () => {
    setIsEditing(false);
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
  };

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
              <IconButton size="small" onClick={handleSave} disabled={!canSave}>
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
            <Typography variant="h4">
              {`${firstName} ${lastName} ${customer.isInBrazil ? "🇧🇷" : "🌐"}`}
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Edit Name">
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </>
      )}
    </Grid>
  );
};
