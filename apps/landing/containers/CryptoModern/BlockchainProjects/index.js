import React from "react";
import Heading from "common/components/Heading";
import Container from "common/components/UI/Container";
import SectionWrapper, { ContentWrapper } from "./blockchainProjects.style";
import { Chart } from "./chart";
import Slide from "react-reveal/Slide";
import Text from "common/components/Text";

const BlockchainProjects = () => {
  return (
    <SectionWrapper id="fund">
      <Container>
        <ContentWrapper>
          <Slide left>
            <div className="chart">
              <Chart />
            </div>
          </Slide>
          <div className="content">
            <Heading content="Produtos de Blockchain no setor imobiliário" />
            <Text content="Em 2022, cerca de 460 produtos baseados em blockchain no setor imobiliário foram contados no mundo inteiro em vários estágios de maturidade. Entretanto, este ainda novo segmento de produtos está mostrando uma clara tendência de crescimento: 16,5% a mais do que no ano anterior de 2021 e 58,6% a mais do que em 2020, o ano da crise de COVID." />
            <a
              href="https://fibree.org"
              target="_blank"
              rel="noreferrer noopener"
            >
              Fonte: Industry Report 2022 - https://fibree.org
            </a>
          </div>
          <div className="gradientDiv"></div>
        </ContentWrapper>
      </Container>
    </SectionWrapper>
  );
};
export default BlockchainProjects;
