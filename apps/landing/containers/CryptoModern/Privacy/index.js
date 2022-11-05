import React from "react";
import Fade from "react-reveal/Fade";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import NextImage from "common/components/NextImage";
import Container from "common/components/UI/Container";
import SectionWrapper, { ContentWrapper } from "./privacy.style";
import Illustration from "common/assets/image/cryptoModern/illustration1.png";

const PrivacyPortal = () => {
  return (
    <SectionWrapper>
      <Container>
        <ContentWrapper>
          <div className="content">
            <Heading content="Compliance com todos os agentes regulatórios brasileiros" />
            <Text content="A estrutura da AXT é concebida com foco no compliance com BACEN, CVM e CRECI. Aplicamos os conceitos de prevenção à lavagem de dinheiro e corrupção - KYC, AML. Todos os dados levantados são protegidos pela LGPD." />
          </div>
          <div className="image">
            <Fade up>
              <NextImage src={Illustration} alt="Illustration Image" />
            </Fade>
          </div>
        </ContentWrapper>
      </Container>
    </SectionWrapper>
  );
};

export default PrivacyPortal;
