import React from "react";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import Container from "common/components/UI/Container";
import SectionWrapper, { ContentWrapper } from "./wealthStats.style";

const WealthStats = () => {
  return (
    <SectionWrapper id="fund">
      <Container>
        <ContentWrapper>
          <div className="image">
            {/*<NextImage src={FundGraphImg} alt="Graph Image" />*/}
          </div>
          <div className="content">
            <Heading content="Fund raising allocation" />
            <Text content="..." />
          </div>
          <div className="gradientDiv"></div>
        </ContentWrapper>
      </Container>
    </SectionWrapper>
  );
};
export default WealthStats;
