import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const SectionWrapper = styled.div`
  padding: 75px 0 25px;
  position: relative;
  @media (max-width: 1600px) {
    padding: 25px 0 0px;
  }
  @media only screen and (max-width: 1366px) {
    padding: 30px 0;
  }
  @media only screen and (max-width: 667px) {
    padding: 30px 0 0;
  }
`;

export const ImageMask = styled.div`
  @media only screen and (max-width: 1440px) {
    display: none;
  }

  border-radius: 50%;
  position: absolute;
  top: 50px;
  left: -25%;
  opacity: 0.5;
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0) 0%,
      rgba(34, 34, 34, 1) 70%,
      rgba(34, 34, 34, 1) 100%
    );
    transform: scale(1.01);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    height: 100%;
    border-radius: 50%;
    @media only screen and (max-width: 1600px) {
      margin-left: 0;
    }
    @media only screen and (max-width: 480px) {
      max-width: 70%;
    }
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .chart {
    width: 50%;
    height: 400px;
    //padding: 70px 100px 70px 70px;
    @media only screen and (max-width: 991px) {
      width: 50%;
    }
    @media only screen and (max-width: 768px) {
      width: 100%;
      margin-bottom: 40px;
    }
  }
  .content {
    width: 50%;
    @media only screen and (max-width: 991px) {
      width: 50%;
    }
    @media only screen and (max-width: 768px) {
      width: 100%;
      margin-bottom: 50px;
    }
    h2 {
      color: ${themeGet("colors.white", "fff")};
      font-size: 48px;
      line-height: 1.2;
      font-weight: 300;
      letter-spacing: -0.025em;
      margin-bottom: 27px;
      max-width: 370px;
      @media only screen and (max-width: 1440px) {
        font-size: 38px;
      }
      @media only screen and (max-width: 768px) {
        max-width: 100%;
        text-align: center;
      }
      @media only screen and (max-width: 480px) {
        font-size: 30px;
      }
    }
    p {
      font-size: 16px;
      line-height: 28px;
      color: ${themeGet("colors.textColor")};
      max-width: 400px;
      @media only screen and (max-width: 768px) {
        max-width: 100%;
        text-align: center;
      }
    }
  }
`;

export default SectionWrapper;
