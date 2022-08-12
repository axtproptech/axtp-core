import Lottie, {
  LottieComponentProps,
  LottieRefCurrentProps,
} from "lottie-react";
import animation from "./lotties/stockShareIcon.json";
import { createRef, FC, useRef } from "react";

interface AnimatedIconProps
  extends Omit<LottieComponentProps, "animationData"> {
  loopDelay?: number;
  touchable?: boolean;
}

export const AnimatedIconStockShare: FC<AnimatedIconProps> = ({
  loopDelay,
  touchable = false,
  ...rest
}) => {
  let timeoutRef = useRef<NodeJS.Timeout>();
  let ref = useRef<LottieRefCurrentProps | null>(null);

  function cancelTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  function handleAnimationEnd(event: any) {
    if (loopDelay) {
      cancelTimeout();
      timeoutRef.current = setTimeout(() => {
        ref.current?.goToAndPlay(0, true);
      }, loopDelay);
    }

    if (rest.onComplete) {
      rest.onComplete(event);
    }
  }

  function handleOnClick(event: any) {
    if (touchable) {
      cancelTimeout();
      ref.current?.goToAndPlay(0, true);
    }

    if (rest.onClick) {
      rest.onClick(event);
    }
  }

  return (
    <Lottie
      lottieRef={ref}
      animationData={animation}
      loop={false}
      onComplete={handleAnimationEnd}
      onClick={handleOnClick}
      {...rest}
    />
  );
};
