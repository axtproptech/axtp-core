import styled from "styled-components";

export const SpanWrapper = styled.span`
  color: transparent;
  user-select: none;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

  background-image: url(assets/exclusive/textBackground.jpg);
  background-size: 120%;
  animation: 5s bg-animation infinite linear, 23s hue-rotate infinite linear;

  @keyframes bg-animation {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
`;
