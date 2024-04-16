import Input from "common/components/Input";
import Button from "common/components/Button";
import React, { useState } from "react";
import styled from "styled-components";
import Text from "common/components/Text";

const VerificationStatus = {
  Idle: 0,
  VerificationMailSent: 1,
  Verified: 2,
  NotVerified: 3,
  Blocked: 4,
};

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const UnicodeIcon = styled.div`
  font-size: 48px;
  padding: 0.25rem;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  width: 180px;
  height: 20px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
`;

const EmailRegex = /^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/;

export const ValidatedEmailInput = ({ onValidEmail }) => {
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(
    VerificationStatus.Idle
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleOnValidate = async () => {
    setError("");
    setIsSubmitting(true);
    // TODO: this is just a dummy
    const sent = await new Promise((resolve) =>
      setTimeout(() => resolve(true), 1000)
    );
    setIsSubmitting(false);

    if (sent) {
      setVerificationStatus(VerificationStatus.VerificationMailSent);
    }

    // some error message

    // 1. send email with token
    // 2. open token input field
    // 3. send token for validation
    // -> if ok: call onValidatedEmail(email)
    // -> if not ok: Show error. -> think of blocking when too many wrong inputs: look wallet
    console.log("Validate");
  };

  const handleOnEmailChange = (email) => {
    setError("");
    setEmail(email);
  };

  const handleOnVerificationCodeChange = (code) => {
    setError("");
    setVerificationCode(code);
  };

  const handleOnConfirmCode = async () => {
    // send code for verification
    // if ok then onValidEmail(e)
    setError("");
    setIsSubmitting(true);
    // TODO: this is just a dummy
    const isValid = await new Promise((resolve) =>
      setTimeout(() => resolve(true), 1000)
    );
    setIsSubmitting(false);
    setVerificationStatus(
      isValid ? VerificationStatus.Verified : VerificationStatus.NotVerified
    );
  };

  const handleReset = () => {
    setError("");
    setVerificationStatus(VerificationStatus.Idle);
    setVerificationCode("");
    setEmail("");
  };

  return (
    <>
      {verificationStatus === VerificationStatus.Idle && (
        <FormWrapper>
          <Input
            label={"Email"}
            inputType="email"
            placeholder={"johndoe@gmail.com"}
            value={email}
            onChange={handleOnEmailChange}
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
          <ActionButton
            title="Verificar"
            colors="warningWithBg"
            onClick={handleOnValidate}
            isLoading={isSubmitting}
            disabled={!EmailRegex.test(email) || isSubmitting}
          />
        </FormWrapper>
      )}

      {verificationStatus === VerificationStatus.VerificationMailSent && (
        <>
          <Text content="Um Código de Verificação foi enviado para o seu endereço de e-mail fornecido. Para prosseguir, por favor, confirme o seu e-mail utilizando este Código de Verificação." />
          <FormWrapper>
            <Input
              label={"Código de Verificação"}
              inputType="text"
              placeholder={"AB0123"}
              value={verificationCode}
              onChange={handleOnVerificationCodeChange}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
            <ActionButton
              title="Confirmar"
              colors="warningWithBg"
              onClick={handleOnConfirmCode}
              isLoading={isSubmitting}
              disabled={verificationCode.length < 1 || isSubmitting}
            />
          </FormWrapper>
        </>
      )}
      {verificationStatus === VerificationStatus.Verified && (
        <ResultWrapper>
          <UnicodeIcon>👍</UnicodeIcon>
          <Text content="Verificação sucessida." />
        </ResultWrapper>
      )}

      {verificationStatus === VerificationStatus.NotVerified && (
        <ResultWrapper>
          <UnicodeIcon>👎</UnicodeIcon>
          <Text content="Verificação não sucessida." />
          <Button title="Tentar Novamente" onClick={handleReset} />
        </ResultWrapper>
      )}

      {verificationStatus === VerificationStatus.Blocked && (
        <ResultWrapper>
          <UnicodeIcon>🚫</UnicodeIcon>
          <Text content="Bloqueado!" />
        </ResultWrapper>
      )}
    </>
  );
};
