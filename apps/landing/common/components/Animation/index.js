import { css, keyframes } from "styled-components";

const spinner = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
    opacity: 0.5;
  }
  100% {
    transform: rotate(360deg);
  }
`;

const AnimSpinner = css`
  animation: ${spinner} 1s linear infinite;
`;

const pulse = keyframes`
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
`;

const AnimPulse = css`
  animation: ${pulse} 0.5s alternate infinite;
`;
export { AnimSpinner, AnimPulse };
