import React from "react";
import Zoom from "react-reveal/Zoom";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import Image from "common/components/Image";
import Container from "common/components/UI/Container";
import SectionWrapper, { ContentWrapper, ImageMask } from "./markets.style";
import pattern from "common/assets/image/cryptoModern/stockchart.svg";
import { Chart } from "./chart";

const MarketsPortal = () => {
  return (
    <SectionWrapper id="markets">
      <ImageMask>
        <Image className="patternImg" src={pattern?.src} alt="pattern Image" />
      </ImageMask>
      <Container>
        <ContentWrapper>
          <div className="content">
            <Heading content="77,8% da riqueza mundial está alocada em bens imóveis" />
            <Text content="Você sabia que a riqueza mundial é estimada em 360,6 trilhões de dólares? Desse total, 280,6 trilhões de dólares (quase 78%) estão em imóveis, dos quais 22% estão nos EUA. Isto equivale a cerca de 61,7 trilhões de dólares." />
            <a
              href="https://www.visualcapitalist.com/all-of-the-worlds-money-and-markets-in-one-visualization-2020"
              target="_blank"
              rel="noreferrer noopener"
            >
              Fonte: https://www.visualcapitalist.com
            </a>
          </div>

          <Zoom>
            <div className="chart">
              <Chart />
            </div>
          </Zoom>
        </ContentWrapper>
      </Container>
    </SectionWrapper>
  );
};
export default MarketsPortal;
