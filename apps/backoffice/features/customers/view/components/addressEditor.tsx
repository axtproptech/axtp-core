import React, { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  IconButton,
  TextField,
  Button,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { Address } from "@/bff/types/address";

type AddressEditorProps = {
  address: number | Address;
};
const AddressEditor = ({ address }: AddressEditorProps) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchAddressFromAPI = async (zipCode: String) => {
    const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
    const data = await response.json();

    setValue("line1", data.logradouro);
    setValue("line2", data.bairro);
    setValue("line3", data.complemento);
    setValue("city", data.localidade);
    setValue("state", data.uf);
    setValue("country", data ? "Brasil" : "");
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value;
    if (zipCode.split("-").join("").length >= 8) {
      fetchAddressFromAPI(zipCode);
    }
  };

  const onSubmit = (data: any) => {
    //TODO: API call to save address
    handleClose();
  };

  return (
    <div>
      <Tooltip title="Edit Address">
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleOpen}
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          Edit Address
        </Button>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "1rem",
              maxWidth: "80vw",
            }}
          >
            <h2>Edit Address</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="ZipCode"
                fullWidth
                margin="normal"
                {...register("zipCode", { required: true })}
                onChange={handleZipChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode && "ZipCode is required"}
              />
              <TextField
                label="Street"
                fullWidth
                margin="normal"
                defaultValue={typeof address !== "number" ? address.line1 : ""}
                {...register("line1", { required: true })}
                error={!!errors.line1}
                helperText={errors.line1 && "Street is required"}
              />
              <TextField
                label="Complement"
                fullWidth
                defaultValue={typeof address !== "number" ? address.line2 : ""}
                margin="normal"
                {...register("line2")}
              />
              <TextField
                label="Annotation"
                fullWidth
                defaultValue={typeof address !== "number" ? address.line3 : ""}
                margin="normal"
                {...register("line3")}
              />
              <TextField
                label="City"
                fullWidth
                defaultValue={typeof address !== "number" ? address.city : ""}
                margin="normal"
                {...register("city")}
              />
              <TextField
                label="State"
                fullWidth
                defaultValue={typeof address !== "number" ? address.state : ""}
                margin="normal"
                {...register("state")}
              />
              <TextField
                label="Country"
                fullWidth
                defaultValue={
                  typeof address !== "number" ? address.country : ""
                }
                margin="normal"
                {...register("country")}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem" }}
              >
                Save
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default AddressEditor;
