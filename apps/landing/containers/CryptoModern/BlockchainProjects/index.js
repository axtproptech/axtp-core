import React from "react";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import Container from "common/components/UI/Container";
import SectionWrapper, { ContentWrapper } from "./blockchainProjects.style";
import { Chart } from "./chart";
import Slide from "react-reveal/Slide";

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
            <Heading content="Produtos de Blockchain no Real Estate" />
            <Text content=" To Do text here" />
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
