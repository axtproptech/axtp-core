import Input from "common/components/Input";
import Button from "common/components/Button";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "common/components/Text";
import {
  sendVerificationEmail,
  verifyEmailVerificationCode,
} from "common/services/EmailValidationService";
import PropTypes from "prop-types";
import { useSafeState } from "common/hooks/useSafeState";

const VerificationStatus = {
  Idle: 0,
  VerificationMailSent: 1,
  Verified: 2,
  NotVerified: 3,
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
  padding: 0 1rem !important;
  height: 20px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
`;

const EmailRegex = /^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/;

const MaxTrials = 3;

export const VerifiedEmailInput = ({ onValidEmail, firstName, disabled }) => {
  const [email, setEmail] = useSafeState("");
  const [verificationCode, setVerificationCode] = useSafeState("");
  const [verificationStatus, setVerificationStatus] = useSafeState(
    VerificationStatus.Idle
  );
  const [isSubmitting, setIsSubmitting] = useSafeState(false);
  const [error, setError] = useSafeState("");
  const [trialCounter, setTrialCounter] = useSafeState(0);

  useEffect(() => {
    if (verificationStatus === VerificationStatus.Verified) {
      onValidEmail(email);
    }
  }, [email, verificationStatus]);

  const handleOnValidate = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await sendVerificationEmail({
        email,
        name: firstName,
      });
      setVerificationStatus(VerificationStatus.VerificationMailSent);
    } catch (e) {
      console.error(e.message);
      setError(
        "Envio de Email de Verificação falhou. Por favor, tente de novo ou entre em contato conosco: support@axtp.com.br"
      );
    } finally {
      setIsSubmitting(false);
    }
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
    try {
      await verifyEmailVerificationCode({
        email,
        verificationCode,
      });
      setVerificationStatus(VerificationStatus.Verified);
    } catch (e) {
      console.error(e.message);
      if (trialCounter >= MaxTrials) {
        reset();
        setError("Máximo de tentativas atingidas.");
      } else {
        setTrialCounter(trialCounter + 1);
        setError("Verificação falhou. Por favor, tente de novo.");
        setVerificationStatus(VerificationStatus.NotVerified);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setError("");
    setVerificationStatus(VerificationStatus.Idle);
    setVerificationCode("");
    setEmail("");
    setTrialCounter(0);
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
            disabled={disabled}
          />
          <ActionButton
            title="Verificar"
            colors="warningWithBg"
            onClick={handleOnValidate}
            isLoading={isSubmitting}
            disabled={!EmailRegex.test(email) || isSubmitting || disabled}
          />
        </FormWrapper>
      )}

      {verificationStatus === VerificationStatus.VerificationMailSent && (
        <>
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
              disabled={disabled}
            />
            <ActionButton
              title="Confirmar"
              colors="warningWithBg"
              onClick={handleOnConfirmCode}
              isLoading={isSubmitting}
              disabled={verificationCode.length < 1 || isSubmitting || disabled}
            />
          </FormWrapper>
          <Text content="Um Código de Verificação foi enviado para o seu endereço de e-mail fornecido. Para prosseguir, por favor, confirme o seu e-mail utilizando este Código de Verificação." />
        </>
      )}
      {verificationStatus === VerificationStatus.Verified && (
        <>
          <FormWrapper>
            <Input
              label={"Código de Verificação"}
              inputType="text"
              placeHolder="✅ Verificado com sucesso"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              disabled={true}
            />
            <ActionButton
              title="Verificado"
              onClick={() => {}}
              style={{
                backgroundColor: "green",
                cursor: "default",
              }}
            />
          </FormWrapper>
        </>
      )}
      {verificationStatus === VerificationStatus.NotVerified && (
        <>
          <FormWrapper>
            <Input
              label={"Código de Verificação"}
              inputType="text"
              placeHolder="Try again!"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              value={verificationCode}
              onChange={handleOnVerificationCodeChange}
              disabled={disabled}
            />
            <ActionButton
              title="Confirmar"
              colors="warningWithBg"
              onClick={handleOnConfirmCode}
              isLoading={isSubmitting}
              disabled={verificationCode.length < 1 || isSubmitting || disabled}
            />
          </FormWrapper>
        </>
      )}
      {error && <Text content={error} as="p" style={{ color: "red" }} />}
    </>
  );
};

VerifiedEmailInput.propTypes = {
  firstName: PropTypes.string.isRequired,
  onValidEmail: PropTypes.func.isRequired,
};
