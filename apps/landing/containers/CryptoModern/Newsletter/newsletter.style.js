import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const NewsletterWrapper = styled.div`
  position: relative;
  background-color: ${themeGet("colors.yellowTrans")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 60px 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  z-index: 1;
  margin-top: 100px;
  @media (max-width: 1220px) {
    padding: 35px 40px;
  }
  @media (max-width: 990px) {
    flex-wrap: wrap;
    justify-content: center;
  }
  @media (max-width: 575px) {
    padding: 35px 20px;
    margin-top: 50px;
  }

  .container {
    display: flex;
  }
`;

export const StyledButton = styled.div`
  .reusecore__button {
    background-image: linear-gradient(
      to right,
      ${themeGet("colors.yellow")},
      ${themeGet("colors.brown")} 95%
    );

    color: ${themeGet("colors.white")};
    font-size: 14px;
    letter-spacing: -0.1px;
    border-radius: 5px;
    padding-left: 16px;
    padding-right: 16px;
    text-transform: uppercase;

    &:hover {
      box-shadow: ${themeGet("colors.yellow")} 0px 12px 24px -10px;
    }

    @media (max-width: 575px) {
      width: 100%;
      margin-right: 0;
      margin-bottom: 20px;
    }
  }

  text-align: center;
`;

export default NewsletterWrapper;
