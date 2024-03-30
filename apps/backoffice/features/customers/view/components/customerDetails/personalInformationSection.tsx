import { Grid, Stack, Tooltip, Typography } from "@mui/material";
import { cpf } from "cpf-cnpj-validator";
import {
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { ExternalLink } from "@/app/components/links/externalLink";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { EditableField } from "../editableField";
import { EditableFirstNameLastName, Name } from "../editableFirstNameLastName";
import { toDateStr } from "@/app/toDateStr";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { useMemo } from "react";
import { customerService } from "@/app/services/customerService/customerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSWRConfig } from "swr";

interface Props {
  customer: CustomerFullResponse;
}

export const PersonalInformationSection = ({ customer }: Props) => {
  const { showError } = useSnackbar();
  const { mutate } = useSWRConfig();

  const cuid = customer.cuid;

  const cpfValid = useMemo(() => {
    return cpf.isValid(customer.cpfCnpj);
  }, [customer.cpfCnpj]);

  const handleFieldValueChange = async (name: string, updatedData: any) => {
    try {
      await customerService.with(cuid).updateCustomer({ [name]: updatedData });
    } catch (e: any) {
      console.error("Updating customer failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${cuid}`);
    }
  };
  const handleMotherNameChange = async ({ firstName, lastName }: Name) => {
    try {
      await customerService.with(cuid).updateCustomer({
        firstNameMother: firstName,
        lastNameMother: lastName,
      });
      await mutate(`getCustomer/${cuid}`);
    } catch (e: any) {
      console.error("Updating customer failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${cuid}`);
    }
  };
  return (
    <>
      <Typography variant="h4">Personal Information</Typography>
      <Grid container columnSpacing={1} direction="row" alignItems="center">
        <Grid item>
          <LabeledTextField label="CPF" text={customer.cpfCnpj} />
        </Grid>
        <Grid item>
          {cpfValid ? (
            <Tooltip title="Valid Format">
              <CheckIcon color="success" />
            </Tooltip>
          ) : (
            <Tooltip title="Format Incorrect">
              <ErrorIcon color="error" />
            </Tooltip>
          )}
        </Grid>
        <Grid item>
          <ExternalLink
            href={`https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp?cpf=${customer.cpfCnpj}`}
          >
            Validate CPF
          </ExternalLink>
        </Grid>
      </Grid>
      <EditableField
        label="Phone Number"
        initialValue={customer.phone1}
        name="phone1"
        onSubmit={handleFieldValueChange}
      />
      {/*TODO: email must be integrated into Brevo also! - backend!*/}
      <EditableField
        label="Email"
        initialValue={customer.email1}
        name="email1"
        onSubmit={handleFieldValueChange}
      />

      <EditableField
        label="Date of Birth"
        initialValue={new Date(customer.dateOfBirth)}
        name="dateOfBirth"
        onSubmit={handleFieldValueChange}
      />
      <EditableField
        label="Place of Birth"
        initialValue={customer.placeOfBirth}
        name="placeOfBirth"
        onSubmit={handleFieldValueChange}
      />
      <EditableField
        label="Nationality"
        initialValue={customer.nationality}
        name="nationality"
        onSubmit={handleFieldValueChange}
      />
      <LabeledTextField
        label="Brazilian Resident"
        text={customer.isInBrazil ? "YES" : "NO"}
      />
      <EditableFirstNameLastName
        label="Mother's Name"
        name={{
          firstName: customer.firstNameMother,
          lastName: customer.lastNameMother,
        }}
        onSubmit={handleMotherNameChange}
      />
      <LabeledTextField
        label="Verification Level"
        text={customer.verificationLevel}
      />
      <Stack direction="row">
        <LabeledTextField
          label="Applied on"
          text={toDateStr(new Date(customer.createdAt))}
        />
        <LabeledTextField
          label="Last Updated"
          text={toDateStr(new Date(customer.updatedAt))}
        />
      </Stack>
    </>
  );
};
