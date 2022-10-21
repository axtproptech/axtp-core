import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const FooterWrapper = styled.footer`
  position: relative;
  overflow: hidden;
  @media (min-width: 576px) {
    padding-top: 170px;
    margin-top: -150px;
    background-color: transparent;
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      padding-bottom: 104%;
      top: 35%;
      left: 0;
      pointer-events: none;
      background-image: linear-gradient(
        35deg,
        rgb(157, 116, 35) 0%,
        rgb(34, 34, 34) 60%
      );
      @media (max-width: 767px) {
        padding-bottom: 150%;
      }
    }
  }

  .footer_container {
    background-repeat: no-repeat;
    background-position: center 50px;
    padding-top: 80px;
    padding-bottom: 80px;
    position: relative;
    text-align: center;
    @media (max-width: 990px) {
      padding-bottom: 20px;
    }
  }
`;

const List = styled.ul``;

const ListItem = styled.li`
  a {
    color: ${themeGet("colors.linkColor")};
    font-size: 14px;
    line-height: 36px;
    transition: all 0.2s ease;
    font-weight: 300;
    &:hover,
    &:focus {
      outline: 0;
      text-decoration: none;
      color: ${themeGet("colors.linkColorHover")};
    }
  }
`;

export { List, ListItem };

export default FooterWrapper;
