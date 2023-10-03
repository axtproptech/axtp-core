import React from "react";
import { Button, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { TextInput } from "@/app/components/inputs";
import { cpf } from "cpf-cnpj-validator";
// @ts-ignore
import InputMask from "react-input-mask";

type CustomerSearchFilterProps = {
  setName: (e: string) => void;
  setIsActive: (e: boolean) => void;
  setIsBlocked: (e: boolean) => void;
  setIsInBrazil: (e: boolean) => void;
  setIsInvited: (e: boolean) => void;
  setEmail: (e: string) => void;
  setShowTable: (e: boolean) => void;
  setIsVerified: (e: boolean) => void;
  setCPF: (e: string) => void;
  name: string;
  email: string;
  cpf: string;
  isActive: boolean;
  isBlocked: boolean;
  isInBrazil: boolean;
  isInvited: boolean;
  isVerified: boolean;
  fetchCustomers: () => void;
};

export const CustomerSearchFilters = ({
  setName,
  name,
  setIsActive,
  setIsBlocked,
  setIsInBrazil,
  setIsInvited,
  setShowTable,
  setIsVerified,
  setEmail,
  setCPF,
  email,
  isActive,
  isBlocked,
  isInBrazil,
  isInvited,
  isVerified,
  cpf: cpfValue,
  fetchCustomers,
}: CustomerSearchFilterProps) => {
  const inputForm = [
    {
      name: "name",
      label: "Name",
      value: name,
      onChange: setName,
    },
    {
      name: "cpf",
      label: "CPF",
      value: cpfValue,
      onChange: setCPF,
      mask: "999.999.999-99",
    },
    {
      name: "email",
      label: "Email",
      value: email,
      onChange: setEmail,
    },
  ];

  const checkboxForm = [
    {
      name: "isActive",
      label: "Active",
      value: isActive,
      onChange: setIsActive,
    },
    {
      name: "isBlocked",
      label: "Blocked",
      value: isBlocked,
      onChange: setIsBlocked,
    },
    {
      name: "isInBrazil",
      label: "Brazilian",
      value: isInBrazil,
      onChange: setIsInBrazil,
    },
    {
      name: "isInvited",
      label: "Invited",
      value: isInvited,
      onChange: setIsInvited,
    },
    {
      name: "isVerified",
      label: "Verified",
      value: isVerified,
      onChange: setIsVerified,
    },
  ];

  const handleOnCLick = async () => {
    await fetchCustomers();
    setShowTable(true);
  };

  return (
    <Grid marginBottom={8}>
      <Grid container>
        <Grid item md={12}>
          {inputForm &&
            inputForm.map((input) => {
              return input.mask ? (
                <InputMask
                  key={input.name}
                  mask={input.mask}
                  value={input.value}
                  disabled={false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    input.onChange(e.target.value)
                  }
                  maskChar=" "
                >
                  {() => <TextInput label={input.label} />}
                </InputMask>
              ) : (
                <TextInput
                  key={input.name}
                  label={input.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    input.onChange(e.target.value)
                  }
                  value={input.value}
                />
              );
            })}
        </Grid>
        <Grid container>
          <h2>Status:</h2>
          <Grid item ml={2} marginBottom={2} md={12}>
            {checkboxForm &&
              checkboxForm.map((checkbox) => (
                <FormControlLabel
                  key={checkbox.name}
                  control={
                    <Checkbox
                      checked={checkbox.value}
                      value={checkbox.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        checkbox.onChange(e.target.checked)
                      }
                      name={checkbox.name}
                    />
                  }
                  label={checkbox.label}
                />
              ))}
          </Grid>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Button
          style={{
            fontSize: 28,
            lineHeight: 2.4,
            letterSpacing: 4,
            borderRadius: 0,
            width: "100%",
          }}
          variant="contained"
          onClick={handleOnCLick}
          disabled={!!cpfValue && !cpf.isValid(cpfValue)}
        >
          SEARCH
        </Button>
        {!!cpfValue && !cpf.isValid(cpfValue) && (
          <p style={{ color: "red", fontSize: 12, marginTop: 10 }}>
            Invalid CPF
          </p>
        )}
      </div>
    </Grid>
  );
};
