import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { TextInput } from "@/app/components/inputs";
import { cpf } from "cpf-cnpj-validator";
// @ts-ignore
import InputMask, { Props as InputMaskProps } from "react-input-mask";
import { useRouter } from "next/router";
import { CustomerFilterType } from "./types";

interface CustomerSearchFilterProps {
  onSearch: (filters: CustomerFilterType) => void;
}

export const CustomerSearchFilters = ({
  onSearch,
}: CustomerSearchFilterProps) => {
  const router = useRouter();

  const [filters, setFilters] = useState<CustomerFilterType>({
    name: "",
    email: undefined,
    cpf: undefined,
    verified: true,
    blocked: undefined,
    active: undefined,
    invited: undefined,
    brazilian: undefined,
    allStatus: false,
  });

  const inputForm = [
    {
      name: "name",
      label: "Name",
      value: filters.name,
    },
    {
      name: "cpf",
      label: "CPF",
      value: filters.cpf,
      mask: "999.999.999-99",
    },
    {
      name: "email",
      label: "Email",
      value: filters.email,
    },
  ];

  const checkboxForm = [
    {
      name: "active",
      label: "Active",
      value: filters.active,
    },
    {
      name: "blocked",
      label: "Blocked",
      value: filters.blocked,
    },
    {
      name: "brazilian",
      label: "Brazilian",
      value: filters.brazilian,
    },
    {
      name: "invited",
      label: "Invited",
      value: filters.invited,
    },
    {
      name: "verified",
      label: "Verified",
      value: filters.verified,
    },
    {
      name: "allStatus",
      label: "All Status",
      value: filters.allStatus,
    },
  ];

  const handleChangeFilter = (
    e: string | boolean | undefined,
    propName: string
  ) => {
    if (propName === "allStatus") {
      setFilters({
        ...filters,
        verified: undefined,
        blocked: undefined,
        active: undefined,
        invited: undefined,
        brazilian: undefined,
        allStatus: true,
      });
    } else if (
      propName === "active" ||
      propName === "blocked" ||
      propName === "invited" ||
      propName === "verified" ||
      propName === "brazilian"
    ) {
      setFilters({ ...filters, [propName]: e, allStatus: false });
    } else {
      setFilters({ ...filters, [propName]: e });
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;
    console.log({ query });
    if (Object.keys(query).length > 0) {
      setFilters({
        name: (query.name as string) || "",
        email: (query.email as string) || undefined,
        cpf: (query.cpf as string) || undefined,
        verified: query.verified == "true",
        blocked: query.blocked == "true" || undefined,
        active: query.active == "true" || undefined,
        invited: query.invited == "true" || undefined,
        brazilian: query.brazilian == "true" || undefined,
      });
    }
  }, [router.isReady]);

  const handleOnSearch = async () => {
    onSearch(filters);
  };

  return (
    <Grid container spacing={3} marginBottom={8}>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        {inputForm.map((input) => (
          <div key={input.name} style={{ marginBottom: "1.5rem" }}>
            {input.mask ? (
              <InputMask
                mask={input.mask}
                value={input.value}
                disabled={false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeFilter(e.target.value, input.name)
                }
                maskChar=" "
              >
                {<TextInput label={input.label} />}
              </InputMask>
            ) : (
              <TextInput
                label={input.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeFilter(e.target.value, input.name)
                }
                value={input.value}
              />
            )}
          </div>
        ))}
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleOnSearch}
          disabled={!!filters.cpf && !cpf.isValid(filters.cpf)}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            letterSpacing: "2px",
            marginTop: "1rem",
          }}
        >
          SEARCH
        </Button>
        {!!filters.cpf && !cpf.isValid(filters.cpf) && (
          <Typography
            color="error"
            align="center"
            style={{ marginTop: "0.5rem" }}
          >
            Invalid CPF
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography
          variant="h6"
          gutterBottom
          style={{
            fontWeight: 600,
            marginBottom: "1.5rem",
            fontSize: "1.2rem",
            color: "#333",
            letterSpacing: "0.5px",
          }}
        >
          Status
        </Typography>
        <Grid container spacing={2}>
          {checkboxForm.map((checkbox, index) => (
            <Grid item xs={6} key={index} style={{ marginBottom: "1rem" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkbox.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeFilter(e.target.checked, checkbox.name)
                    }
                    name={checkbox.name}
                  />
                }
                label={checkbox.label}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
