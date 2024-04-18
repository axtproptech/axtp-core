// import JotForm from "jotform-react";
import Input from "common/components/Input";
import { useEffect, useState } from "react";
import { VerifiedEmailInput } from "./components/VerifiedEmailInput";
import styled from "styled-components";
import Switch from "common/components/Switch";
import { useSafeState } from "common/hooks/useSafeState";
import Button from "common/components/Button";
import Text from "common/components/Text";
import PropTypes from "prop-types";

const NameInputWrapper = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  column-gap: 1rem;
  @media (max-width: 768px) {
    row-gap: 1rem;
    flex-direction: column;
  }
`;

const InitialFormState = {
  isBrazilian: false,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export default function PreKycForm({ onSubmit }) {
  const [formState, setFormState] = useState({ ...InitialFormState });
  const [isSubmitting, setIsSubmitting] = useSafeState(false);
  const { email, isBrazilian, firstName, lastName } = formState;

  const handleOnChange = (name) => (value) => {
    setFormState((formState) => ({
      ...formState,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      setIsSubmitting(true);

      // TODO: store user on backend.

      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(true, formState);
    } catch (e) {
      console.error("Submission failed", e);
      const resetState = { ...InitialFormState };
      setFormState(resetState);
      onSubmit(false, resetState);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasName = firstName.length > 0 && lastName.length > 0;
  const hasMail = email.length > 0;
  const canSubmit = hasMail && hasName;
  const disableIsBrazilian = canSubmit;
  const disableName = canSubmit;
  const disableEmail = !hasName || canSubmit;
  const disablePhone = !hasName || !hasMail;
  return (
    <>
      <Switch
        labelText={"Possui CPF (Residente Brasileiro)"}
        labelPosition="right"
        switchSize="60px"
        onChange={handleOnChange("isBrazilian")}
        isChecked={isBrazilian}
        disabled={disableIsBrazilian}
      />
      <NameInputWrapper>
        <Input
          label={"Primeiro Nome"}
          required={true}
          inputType="text"
          placeholder={"Jane"}
          onChange={handleOnChange("firstName")}
          disabled={disableName}
        />
        <Input
          label={"Sobrenome"}
          required={true}
          inputType="text"
          placeholder={"Doe"}
          onChange={handleOnChange("lastName")}
          disabled={disableName}
        />
      </NameInputWrapper>
      <VerifiedEmailInput
        onValidEmail={handleOnChange("email")}
        firstName={firstName}
        disabled={disableEmail}
      />

      <Input
        label={"Fone"}
        required={false}
        inputType="text"
        placeholder={"+5511987654321"}
        onChange={handleOnChange("phone")}
        disabled={disablePhone}
        hint="Opcional, em caso que deseje um contato pessoal"
      />

      <Button
        title="Submeter"
        colors="warningWithBg"
        isLoading={isSubmitting}
        disabled={!canSubmit}
        onClick={handleClick}
        style={{
          width: "180px",
          margin: "1.5rem auto 0",
        }}
      />
    </>
  );
}

PreKycForm.propTypes = {
  onSubmit: PropTypes.func,
};
