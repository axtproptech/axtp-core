import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "common/components/Box";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import Button from "common/components/Button";
import Container from "common/components/UI/Container";

import NewsletterWrapper, { StyledButton } from "./newsletter.style";
import { RegisterForm } from "common/components/RegisterForm";
import { Modal } from "common/components/Modal";

const Register = ({
  sectionWrapper,
  textArea,
  buttonArea,
  buttonStyle,
  title,
  description,
}) => {
  const openModal = () => {
    window.dispatchEvent(new CustomEvent("open-register-modal"));
  };

  return (
    <Box id="access" {...sectionWrapper} as="section">
      <Container>
        <NewsletterWrapper>
          <Box {...textArea}>
            <Heading
              content="Interessado? Solicite mais informações"
              {...title}
            />
            <Text
              content="Você gostaria de saber mais sobre nossas atividades? Basta deixar seu e-mail. Nós entraremos em contato com você."
              {...description}
            />
          </Box>
          <Box {...buttonArea}>
            <StyledButton>
              <Button
                {...buttonStyle}
                title="Quero saber mais!"
                onClick={openModal}
              />
            </StyledButton>
          </Box>
        </NewsletterWrapper>
      </Container>
    </Box>
  );
};

Register.propTypes = {
  sectionWrapper: PropTypes.object,
  textArea: PropTypes.object,
  buttonArea: PropTypes.object,
  buttonStyle: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
};

Register.defaultProps = {
  sectionWrapper: {},
  textArea: {
    mb: ["40px", "40px", "40px", "0", "0"],
    pr: ["0", "0", "0", "80px", "100px"],
  },
  title: {
    fontSize: ["20px", "22px", "24px", "26px"],
    color: "#fff",
    lineHeight: "1.34",
    mb: ["14px", "14px", "14px", "14px", "13px"],
    textAlign: ["center", "center", "center", "left", "left"],
  },
  description: {
    fontSize: ["14px", "14px"],
    maxWidth: ["100%", "400px"],
    fontWeight: "400",
    color: "#fefefe",
    lineHeight: "1.7",
    mb: 0,
    textAlign: ["center", "center", "center", "left", "left"],
  },
  buttonArea: {
    zIndex: 1,
    width: ["100%", "auto"],
  },
  buttonStyle: {
    type: "button",
    fontSize: "14px",
    fontWeight: "700",
    pl: "30px",
    pr: "30px",
  },
};

export default Register;
