import styled from "styled-components";
import BannerBG from "common/assets/image/cryptoModern/get-start.png";
import { themeGet } from "@styled-system/theme-get";
import colors from "common/theme/cryptoModern/colors";

const NewsletterWrapper = styled.div`
  position: relative;
  //background-image: url(${BannerBG?.src});
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

export const ModalFormWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  border: 4px solid ${colors.yellow};
  filter: drop-shadow(0px 0px 10px #ffb343);
  width: 600px;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    background-color: red;
    width: 100px;
    height: 100px;
  }
  @media (max-width: 575px) {
    width: 100vw;
    border: none;
    filter: none;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
  }
  //
  //.modal {
  //  font-size: 12px;
  //}
  //.modal > .header {
  //  width: 100%;
  //  border-bottom: 1px solid gray;
  //  font-size: 18px;
  //  text-align: center;
  //  padding: 5px;
  //}
  //.modal > .content {
  //  width: 100%;
  //  padding: 10px 5px;
  //}
  //.modal > .actions {
  //  width: 100%;
  //  padding: 10px 5px;
  //  margin: auto;
  //  text-align: center;
  //}
  //.modal > .close {
  //  cursor: pointer;
  //  position: absolute;
  //  display: block;
  //  padding: 2px 5px;
  //  line-height: 20px;
  //  right: -10px;
  //  top: -10px;
  //  font-size: 24px;
  //  background: #ffffff;
  //  border-radius: 18px;
  //  border: 1px solid #cfcece;
  //}
`;

export const ContactFormWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  width: 470px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1220px) {
    width: 420px;
  }
  @media (max-width: 575px) {
    width: 100%;
  }
  @media (max-width: 575px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
    button {
      width: 100%;
    }
  }

  .email_input {
    flex-grow: 1;
    margin-right: 20px;

    @media (max-width: 575px) {
      width: 100%;
      margin-right: 0;
      margin-bottom: 20px;
    }

    &.is-material {
      &.is-focus {
        label {
          font-size: 14px;
          color: #fff;
        }

        .highlight {
          background: #fff;
          height: 1px;
        }
      }
    }

    .highlight {
      background: rgba(255, 255, 255, 0.4);
    }

    input {
      background: transparent;
      font-size: 17px;
      font-weight: 300;
      color: #fff;
      padding: 10px 15px;
      border-color: rgba(255, 255, 255, 0.3);
      @media (max-width: 575px) {
        height: 48px;
      }
    }

    label {
      font-size: 17px;
      color: #fff;
      font-weight: 400;
      padding-left: 10px;
      top: 5px;
      pointer-events: none;
    }
  }

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
  }

  text-align: center;
`;

export default NewsletterWrapper;
