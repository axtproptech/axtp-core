import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Box from "common/components/Box";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import Logo from "common/components/UIElements/Logo";
import Container from "common/components/UI/Container";
import FooterWrapper, { List, ListItem } from "./footer.style";

import LogoImage from "common/assets/image/cryptoModern/logo-light.svg";

import { Footer_Data } from "common/data/CryptoModern";
import colors from "common/theme/cryptoModern/colors";
import Tooltip from "../../../common/components/Tooltip";

const Footer = ({
  row,
  col,
  colOne,
  colTwo,
  titleStyle,
  logoStyle,
  textStyle,
  creditsStyle,
}) => {
  return (
    <FooterWrapper>
      <Container className="footer_container">
        <Box className="row" {...row}>
          <Box {...colOne}>
            <Logo
              href="#"
              logoSrc={LogoImage}
              title="Hosting"
              logoStyle={logoStyle}
            />
            <Text content="contact@axtp.com" {...textStyle} />
            <Text content="+479-443-9334" {...textStyle} />
          </Box>
          {/* End of footer logo column */}
          <Box {...colTwo}>
            {Footer_Data.map((widget, index) => (
              <Box className="col" {...col} key={`footer-widget-${index}`}>
                <Heading content={widget.title} {...titleStyle} />
                <List>
                  {widget.menuItems.map((item, index) => (
                    <ListItem key={`footer-list-item-${index}`}>
                      <Link href={item.url}>
                        <a className="ListItem">{item.text}</a>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
          {/* End of footer List column */}
        </Box>
        <Box {...creditsStyle}>
          <div>
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/icongeek26"
              title="Icongeek26"
            >
              Icongeek26
            </a>
            {", "}
            <a href="https://www.flaticon.com/authors/rean-me" title="Rean-me">
              Rean-me
            </a>
            {", "}
            <a href="https://www.freepik.com" title="Freepik">
              Freepik
            </a>
            {", "}
            <a
              href="https://www.flaticon.com/authors/ahmad-roaayala"
              title="Ahmad Roaayala"
            >
              Ahmad Roaayala
            </a>
            {", "}
            <a href="https://www.flaticon.com/authors/luke-vo" title="Luke Vo">
              Luke Vo
            </a>
            {", "}
            <a href="https://www.flaticon.com/authors/mj" title="mj">
              mj
            </a>
            {", "}
            <a
              href="https://www.flaticon.com/authors/juicy-fish"
              title="juicy_fish"
            >
              juicy_fish
            </a>
            {", "}
            <a
              href="https://www.flaticon.com/authors/parzival-1997"
              title="Parzival’ 1997"
            >
              Parzival’ 1997
            </a>
            {", "}
            <a
              href="https://www.flaticon.com/authors/bima-pamungkas"
              title="Bima Pamungkas"
            >
              Bima Pamungkas
            </a>
            {" from "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

// Footer style props
Footer.propTypes = {
  row: PropTypes.object,
  col: PropTypes.object,
  colOne: PropTypes.object,
  colTwo: PropTypes.object,
  titleStyle: PropTypes.object,
  textStyle: PropTypes.object,
  logoStyle: PropTypes.object,
};

// Footer default style
Footer.defaultProps = {
  // Footer row default style
  row: {
    flexBox: true,
    flexWrap: "wrap",
    ml: "-15px",
    mr: "-15px",
  },
  // Footer col one style
  colOne: {
    width: [1, "35%", "35%", "23%"],
    mt: [0, "13px"],
    mb: ["30px", 0],
    pl: ["15px", 0],
    pr: ["15px", "15px", 0],
  },
  // Footer col two style
  colTwo: {
    width: ["100%", "65%", "65%", "77%"],
    flexBox: true,
    flexWrap: "wrap",
  },
  // Footer col default style
  col: {
    width: ["100%", "50%", "50%", "25%"],
    pl: "15px",
    pr: "15px",
    mb: "30px",
  },
  // widget title default style
  titleStyle: {
    color: colors.textColor,
    fontSize: "16px",
    fontWeight: "700",
    mb: "30px",
  },
  // Default logo size
  logoStyle: {
    width: "100px",
    mb: "15px",
  },
  // widget text default style
  textStyle: {
    color: colors.textColor,
    fontSize: "16px",
    mb: "10px",
    fontWeight: "300",
  },
  creditsStyle: {
    color: colors.textColor,
    fontSize: "10px",
  },
};

export default Footer;
