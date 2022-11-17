import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { Modal } from "common/components/Modal";
import colors from "common/theme/cryptoModern/colors";

const ContentWrapper = styled.div`
  padding: 1rem;
  width: 66%;
  margin: 0 auto;
  h2 {
    text-align: center;
  }
  p {
    color: ${colors.light};
  }
`;

export const MessageBox = () => {
  const router = useRouter();
  const { status } = router.query;

  const handleReroute = async () => {
    await router.replace("/", undefined, { shallow: true });
  };

  const content = useMemo(() => {
    if (status === "existsAlready") {
      return {
        title: "Aviso",
        text: "Já existe um usuário com o email enviado.",
      };
    }
    if (status === "success") {
      return {
        title: "Sucesso",
        text: (
          <>
            <div>
              O cadastro foi enviado com sucesso. Enviamos um email de
              confirmação do recebimento e entraremos em contato com você em
              breve.
            </div>
            <br />
            Obrigado pelo interesse.
          </>
        ),
      };
    }
    if (status === "error") {
      return {
        title: "Não deu certo",
        text: (
          <>
            <div>
              Lamentamos que o envio não deu certo. Tente de novo e se o
              problema persistir enviar um email para{" "}
              <span style={{ fontFamily: "monospace" }}>
                support@axtp.com.br
              </span>
            </div>
          </>
        ),
      };
    }

    return null;
  }, [status]);

  return (
    content && (
      <Modal open={content} onClose={handleReroute}>
        <ContentWrapper>
          <>
            <h2>{content.title}</h2>
            <p>{content.text}</p>
          </>
        </ContentWrapper>
      </Modal>
    )
  );
};
