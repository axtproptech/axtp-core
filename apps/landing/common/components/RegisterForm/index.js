import { useMemo, useState } from "react";
import styled from "styled-components";
import Button from "common/components/Button";
import Text from "common/components/Text";
import PreKycForm from "./PreKycForm";
import { useSafeState } from "common/hooks/useSafeState";

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;

const Steps = {
  Intro: 1,
  Form: 2,
  OutroSuccess: 3,
  OutroAlreadyRegistered: 4,
  OutroFailure: 5,
};

export const RegisterForm = () => {
  const [step, setStep] = useState(Steps.Intro);
  const [firstName, setFirstName] = useSafeState("");

  const handleOnSubmit = (status, { firstName }) => {
    switch (status) {
      case "registered":
        setFirstName(firstName);
        setStep(Steps.OutroSuccess);
        break;
      case "alreadyRegistered":
        setStep(Steps.OutroAlreadyRegistered);
        break;
      default:
        setStep(Steps.OutroFailure);
    }
  };

  const content = useMemo(() => {
    switch (step) {
      default:
      case Steps.Intro:
        return (
          <>
            <Text
              as="p"
              content={
                "Olá, estamos satisfeitos por termos despertado seu interesse. Por favor, preencha o formulário a seguir e lhe enviaremos mais informações sobre a AXT Proptech Company S/A o mais rápido possível. Tratamos seus dados de acordo com as normas de proteção de dados e não transmitimos nenhum dado a terceiros."
              }
            />
            <Button
              title="Prosseguir"
              onClick={() => setStep(Steps.Form)}
              colors="warningWithBg"
            />
          </>
        );
      case Steps.Form:
        return <PreKycForm onSubmit={handleOnSubmit} />;
      case Steps.OutroSuccess:
        return (
          <>
            <Text
              as="h1"
              content="Obrigado 🙏"
              style={{ textAlign: "center", fontSize: "2rem" }}
            />
            <Text
              as="p"
              content={`${firstName}, Agracedemos pelo interesse na AXT PropTech Company S/A.`}
            />
            <Text
              as="p"
              content="Imediatamente enviaremos mais material informativo sobre a AXT PropTech Company S/A. Reservamo-nos o direito de contatá-lo diretamente em breve. No entanto, se preferir, pode nos contatar a qualquer momento pelo info@axtp.com.br."
            />
            <Text
              as="p"
              content="Por favor, note que tratamos seus dados com a mais alta confidencialidade e não os compartilhamos com terceiros."
            />
          </>
        );
      case Steps.OutroAlreadyRegistered:
        return (
          <>
            <Text
              as="h1"
              content="Já Registrado"
              style={{ textAlign: "center", fontSize: "2rem" }}
            />
            <Text
              as="p"
              content="Um usuário com este endereço de email já foi na AXT PropTech Company S/A."
            />
            <Text
              as="p"
              content="Se você acredita que há um engano aqui, entre em contato conosco pelo support@axtp.com.br."
            />
          </>
        );
      case Steps.OutroFailure:
        return (
          <>
            <Text
              as="h1"
              content="Bummer 😢"
              style={{ textAlign: "center", fontSize: "2rem" }}
            />
            <Text
              as="p"
              content="Lamentamos imensamente pelo inconveniente. Algo deu errado. Por favor, tente novamente ou entre em contato com o nosso suporte: support@axtp.com.br"
            />
            <Text as="p" content="Desculpe-nos pelo transtorno." />
          </>
        );
    }
  }, [step]);

  return <Container>{content}</Container>;
};
