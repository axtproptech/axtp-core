// import JotForm from "jotform-react";
import Input from "common/components/Input";
import { useState } from "react";
import { ValidatedEmailInput } from "./components/ValidatedEmailInput";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;

const JotFormId = process.env.NEXT_PUBLIC_JOTFORM_ID;

export const RegisterForm = () => {
  const [formState, setFormState] = useState({ email: "" });

  const handleOnChange = (e) => {
    setFormState((formState) => ({
      [e.target.name]: e.target.value,
      ...formState,
    }));
  };

  return (
    <Container>
      <ValidatedEmailInput onValidEmail={handleOnChange} />

      <Input
        label={"Phone Number"}
        required={true}
        inputType="text"
        placeholder={"+55119876543210"}
        onChange={handleOnChange}
      />
      {/*<JotForm*/}
      {/*  formURL={`https://form.jotform.com/${JotFormId}`}*/}
      {/*  formID={JotFormId}*/}
      {/*/>*/}
    </Container>
  );
};
