import React from "react";
import Fade from "react-reveal/Fade";
import Text from "common/components/Text";
import NextImage from "common/components/NextImage";
import Button from "common/components/Button";
import Heading from "common/components/Heading";
import Container from "common/components/UI/Container";
import BannerWrapper, {
  BannerContent,
  DiscountLabel,
  BannerImage,
  ButtonGroup,
} from "./banner.style";

import bannerImg from "common/assets/image/cryptoModern/home-banner-2.webp";
import colors from "../../../common/theme/cryptoModern/colors";

const Banner = () => {
  const openModal = () => {
    window.dispatchEvent(new CustomEvent("open-register-modal"));
  };

  return (
    <BannerWrapper id="home">
      <Container>
        <BannerContent>
          <Fade up delay={100}>
            <Heading as="h1" content="Bem vindo ao mundo de ativos digitais" />
          </Fade>
          <Fade up delay={200}>
            <Text
              content="Você sabia que é possível participar da disrupção de um mercado sólido e tradicional com segurança e lucratividade?"
              style={{ color: colors.textColor }}
            />
          </Fade>
          <Fade up delay={300}>
            <ButtonGroup>
              <Button
                className="primary"
                title="Quero Saber Mais"
                onClick={openModal}
              />
            </ButtonGroup>
          </Fade>
        </BannerContent>
        <BannerImage>
          <Fade in delay={100}>
            <NextImage src={bannerImg} alt="Banner" />
          </Fade>
        </BannerImage>
      </Container>
    </BannerWrapper>
  );
};

export default Banner;
